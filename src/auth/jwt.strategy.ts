import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ("process.env.JWT_SECRET"), // must match what you used to sign
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email }; // this will become req.user
  }
}
