import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super();
  }

  async validate(token: string): Promise<any> {
    const user = await this.userService.validateUser(token);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}