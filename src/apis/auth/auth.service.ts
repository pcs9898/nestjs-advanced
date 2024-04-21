import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SigninReqDto, SignupReqDto } from './dto/req.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import {
  RestoreRefreshTokenResDto,
  SigninResDto,
  SignupResDto,
  VerifyEmailResDto,
} from './dto/res.dto';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import {
  SALT_ROUNDS,
  THIRTY_DAYS_IN_SECONDS,
} from './constants/auth.constants';
import {
  IAuthServiceRestoreAccessToken,
  IAuthServiceSaveHashedRefreshTokenOnRedis,
  IAuthServiceVerifyEmail,
} from './interface/auth-service.interface';
import * as CryptoJS from 'crypto-js';
import { UserAuth } from './entity/userAuth.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(UserAuth)
    private readonly userAuthRepository: Repository<UserAuth>,
  ) {}

  async signup(data: SignupReqDto): Promise<SignupResDto> {
    const { email, password, passwordConfirm } = data;
    if (password !== passwordConfirm) {
      throw new BadRequestException('Passwords do not match');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let error;

    try {
      const user = await queryRunner.manager.findOneBy(User, { email });
      if (user) throw new UnprocessableEntityException('User already exists');

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const userEntity = await queryRunner.manager.save(
        await queryRunner.manager.create(User, {
          email,
          password: hashedPassword,
        }),
      );

      const authCode = this.generateAuthCode();

      await queryRunner.manager.save(
        queryRunner.manager.create(UserAuth, { user: userEntity, authCode }),
      );

      const unVerifiedToken = this.generateUnVerifiedToken(userEntity.id);

      await this.mailService.sendUserServiceAuthCode({
        email: userEntity.email,
        authCode,
      });

      await queryRunner.commitTransaction();

      return {
        id: userEntity.id,
        unVerifiedToken,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      error = e;
    } finally {
      await queryRunner.release();
      if (error) throw error;
    }
  }

  async signin(data: SigninReqDto): Promise<SigninResDto> {
    const { email, password } = data;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let error;

    try {
      const user = await queryRunner.manager.findOneBy(User, { email });
      if (!user) throw new NotFoundException('User does not exist');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new UnauthorizedException('Password does not match');

      if (!user.is_verified) {
        const authCode = this.generateAuthCode();

        await queryRunner.manager.update(UserAuth, { user }, { authCode });

        const unVerifiedToken = this.generateUnVerifiedToken(user.id);

        await this.mailService.sendUserServiceAuthCode({
          email: user.email,
          authCode,
        });

        await queryRunner.commitTransaction();

        return {
          unVerifiedToken,
        };
      } else {
        const { accessToken, refreshToken, hashedRefreshToken } =
          await this.generateAccessNRefreshNHashedRefreshToken(user.id);

        await this.saveHashedRefreshTokenOnRedis({
          user_id: user.id,
          hashedRefreshToken,
        });

        await queryRunner.commitTransaction();

        return { accessToken, refreshToken };
      }
    } catch (e) {
      await queryRunner.rollbackTransaction();
      error = e;
    } finally {
      await queryRunner.release();
      if (error) throw error;
    }
  }

  async verifyEmail({
    user_id,
    authCode,
  }: IAuthServiceVerifyEmail): Promise<VerifyEmailResDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let error;

    try {
      const user = await queryRunner.manager.findOneBy(User, { id: user_id });
      if (!user) throw new NotFoundException('User does not exist');
      if (user.is_verified) {
        throw new BadRequestException('User already verified');
      }

      const userAuth = await queryRunner.manager
        .getRepository(UserAuth)
        .createQueryBuilder('userAuth')
        .innerJoinAndSelect('userAuth.user', 'user', 'user.id = :user_id', {
          user_id: user.id,
        })
        .getOne();
      if (!userAuth) {
        throw new NotFoundException('User auth sign in plz');
      }

      if (this.isOver20Min(userAuth.updated_at)) {
        throw new BadRequestException(
          'Auth code has expired in 20min, please reissue it',
        );
      }
      if (userAuth.authCode !== authCode) {
        throw new BadRequestException('Auth Code is not match');
      }

      await queryRunner.manager.update(
        User,
        { id: user.id },
        { is_verified: true },
      );
      await queryRunner.manager.remove(userAuth);

      const { accessToken, refreshToken, hashedRefreshToken } =
        await this.generateAccessNRefreshNHashedRefreshToken(user_id);
      await this.saveHashedRefreshTokenOnRedis({ user_id, hashedRefreshToken });

      await queryRunner.commitTransaction();

      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      error = e;
    } finally {
      await queryRunner.release();
      if (error) throw error;
    }
  }

  async restoreAccessToken({
    refreshToken: OldRefreshToken,
    id: user_id,
  }: IAuthServiceRestoreAccessToken): Promise<RestoreRefreshTokenResDto> {
    try {
      const foundHashedRefreshToken = await this.getRefreshToken(user_id);
      if (!foundHashedRefreshToken)
        throw new UnauthorizedException('You are already sign out');

      const hashedOldRefreshToken =
        await this.hashRefreshToken(OldRefreshToken);
      const isMatch = hashedOldRefreshToken === foundHashedRefreshToken;
      if (!isMatch) throw new UnauthorizedException('Wrong refresh token');

      const { accessToken, refreshToken, hashedRefreshToken } =
        await this.generateAccessNRefreshNHashedRefreshToken(user_id);

      await this.saveHashedRefreshTokenOnRedis({ user_id, hashedRefreshToken });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async resendAuthCode({ user_id }: { user_id: string }): Promise<boolean> {
    try {
      const user = await this.userService.findOneById(user_id);
      if (!user) throw new NotFoundException('User not found');
      if (user.is_verified) throw new BadRequestException('User is verified');

      const authCode = this.generateAuthCode();

      await this.userAuthRepository.update({ user }, { authCode });

      await this.mailService.sendUserServiceAuthCode({
        email: user.email,
        authCode,
      });

      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async signout({ user_id }: { user_id: string }): Promise<boolean> {
    const result = await this.getRefreshToken(user_id);
    if (!result) throw new BadRequestException('You are already sign out');

    try {
      await this.removeRefreshToken(user_id);

      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  private async generateAccessNRefreshNHashedRefreshToken(user_id: string) {
    const accessToken = this.generateAccessToken(user_id);
    const refreshToken = this.generateRefreshToken(user_id);
    const hashedRefreshToken = await this.hashRefreshToken(refreshToken);
    return { accessToken, refreshToken, hashedRefreshToken };
  }

  private generateUnVerifiedToken(user_id: string) {
    const payload = { sub: user_id, tokenType: 'unVerifiedToken' };

    return this.jwtService.sign(payload, {
      expiresIn: '20m',
      secret: this.configService.get('jwt.unverifiedSecret'),
    });
  }

  private generateAccessToken(user_id: string) {
    const payload = { sub: user_id, tokenType: 'accessToken' };

    return this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: this.configService.get('jwt.accessSecret'),
    });
  }

  private generateRefreshToken(user_id: string) {
    const payload = { sub: user_id, tokenType: 'refreshToken' };

    return this.jwtService.sign(payload, {
      expiresIn: '30d',
      secret: this.configService.get('jwt.refreshSecret'),
    });
  }

  private async hashRefreshToken(refreshToken: string) {
    return await CryptoJS.SHA256(refreshToken).toString();
  }

  private async saveHashedRefreshTokenOnRedis({
    user_id,
    hashedRefreshToken,
  }: IAuthServiceSaveHashedRefreshTokenOnRedis) {
    await this.redis.set(
      `refresh_token:${user_id}`,
      hashedRefreshToken,
      'EX',
      THIRTY_DAYS_IN_SECONDS,
    );
  }

  private generateAuthCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  private isOver20Min(date: Date): boolean {
    const now = new Date();
    const updatedAt = new Date(date);
    const diffMinutes = (now.getTime() - updatedAt.getTime()) / 1000 / 60;

    return diffMinutes > 20 ? true : false;
  }

  private async getRefreshToken(userId: string) {
    return await this.redis.get(`refresh_token:${userId}`);
  }

  private async removeRefreshToken(userId: string) {
    await this.redis.del(`refresh_token:${userId}`);
  }
}
