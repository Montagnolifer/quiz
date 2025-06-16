import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'A9g$4qT!zR@7nC^LmV&bX2w*Uj8&eFsD',
    });    
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }  
}