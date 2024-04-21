import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import {
  IUserServiceCheckUserIsAdmin,
  IUserServiceCreateUser,
} from './interface/user-service.interface';
import { PageReqDto } from 'src/common/dto/req.dto';
import { UserRole } from 'src/common/enum/global-enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async createUser({ email, password }: IUserServiceCreateUser) {
    const user = await this.userRepository.save({ email, password });
    return user;
  }

  async findAll(data: PageReqDto) {
    const { page, size } = data;

    const users = this.userRepository.find({
      skip: (page - 1) * size,
      take: size,
    });

    return users;
  }

  async findOneById(id: string) {
    const foundUser = await this.userRepository.findOne({ where: { id } });
    console.log(foundUser);
    return foundUser;
  }

  async checkUserIsAdmin({
    user_id,
  }: IUserServiceCheckUserIsAdmin): Promise<boolean> {
    const user = await this.findOneById(user_id);

    return user.role === UserRole.Admin;
  }

  async removeUnVerifiedUserOver30Days() {
    const dateLimit = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const usersToRemove = await this.userRepository
      .createQueryBuilder()
      .select()
      .where('is_verified = :is_verified', { is_verified: false })
      .andWhere('created_at < :dateLimit', { dateLimit })
      .getMany();

    for (const user of usersToRemove) {
      await this.userRepository.remove(user);
    }
  }
}
