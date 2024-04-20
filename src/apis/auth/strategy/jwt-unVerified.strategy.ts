import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { IJwtPayload } from 'src/common/types/global-types';

@Injectable()
export class JwtUnVerifiedStrategy extends PassportStrategy(
  Strategy,
  'unVerified',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.unverifiedSecret'),
    });
  }

  async validate(payload: IJwtPayload) {
    return { id: payload.sub };
  }
}
