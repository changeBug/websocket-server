import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { UserController } from './user/user.controller';
import { User } from './user/user.entity';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';
import { UserToken } from './user/user-token.entity';
import { LocalStrategy } from './user/bearer.strategy';
import { Friend } from './friend/friend.entity';
import { FriendReq } from './friend/friend-req.entity';
import { ChatRecord } from './chat/chat-record.entity';
import { FriendService } from './friend/friend.service';
import { ChatRecordService } from './chat/chat-record.service';
import { TestController } from './chat/test.controller';
console.log(process.env.CHAT_DB_USER);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '139.224.250.252',
      port: 3306,
      username: process.env.CHAT_DB_USER,
      password: process.env.CHAT_DB_PWD,
      database: 'chat',
      entities: [__dirname + '/**/**/*.entity{.ts,.js}'],
      charset: "utf8mb4", // 设置chatset编码为utf8mb4
      autoLoadEntities: true,
      synchronize: true
    }),
    TypeOrmModule.forFeature([
      User, UserToken, Friend, FriendReq, ChatRecord
    ]),
    PassportModule.register({ defaultStrategy: 'bearer' }),
    UserModule
  ],
  controllers: [AppController, UserController, TestController],
  providers: [AppService, ChatGateway, UserService, LocalStrategy, FriendService, ChatRecordService],
})
export class AppModule {}
