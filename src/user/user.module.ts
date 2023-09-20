import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalStrategy } from './bearer.strategy';
import { UserToken } from './user-token.entity';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, UserToken]),
        PassportModule.register({ defaultStrategy: 'bearer' })
    ],
    controllers: [UserController],
    providers: [
        UserService,
        LocalStrategy
    ],
    exports: [UserService],
})
export class UserModule {
    
}
