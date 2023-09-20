import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as svgCaptcha from 'svg-captcha';
import { Repository } from 'typeorm';
import { UserToken } from './user-token.entity';
import { User } from './user.entity';
import { nanoid } from 'nanoid';
import * as moment from 'moment';
// import * as _ from 'lodash';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserToken)
        private readonly userTokenRepository: Repository<UserToken>
    ) {}

    async createUserToken(userId: number) {
        return this.userTokenRepository.save({
            userId,
            token: nanoid(),
            expirationTime: moment().add(24, 'hours').unix()
        });
    }
    // 创建图形验证码
    generateCaptcha(): { data: string, text: string } {
        const captcha = svgCaptcha.create();
        return captcha;
    }

    // 通过phone查找用户
    getUserByPhone(phone: string): Promise<User> {
        return this.userRepository.findOne({ where: { phone } });
    }

    // 注册
    saveUser(phone: string, pwd: string, name: string): Promise<User> {
        const user = new User();
        user.phone = phone;
        user.password = pwd;
        user.name = name;
        return this.userRepository.save(user);
    }

    // 登录
    async login(phone: string, pwd: string) {
        const user = await this.getUserByPhone(phone);
        if (!user) {
            throw new Error('手机号未注册');
        }
        if (user.password !== pwd) {
            throw new Error('密码错误');
        }
        const token = await this.createUserToken(user.id);
        return { 
            token: token.token,
            id: user.id,
            name: user.name,
            phone: user.phone,
            authUrl: user.authUrl
        };
    }

    getUserById(id: number): Promise<User> {
        return this.userRepository.findOne({
            select: ['id', 'name', 'phone', 'authUrl'],
            where: { id }
        });
    }
    async validateUser(token: string) {
        const userToken = await this.userTokenRepository.findOne({ 
            where: { token }
        });
        if (!userToken || !userToken.userId) {
            throw new Error('未找到对应用户');
        }
        const user = await this.userRepository.findOne({ where: { id: userToken.userId } });
        if (!user) {
            throw new Error('未找到对应用户');
        }
        if (!userToken.isOpen && userToken.expirationTime < moment().unix()) {
            throw new Error('token过期，请重新登录');
        };
        return user;
    }
    // 更新用户信息
    async updateUser(user: User) {
        const userInfo = await this.userRepository.save(user);
        return {
            id: userInfo.id,
            name: userInfo.name,
            phone: userInfo.phone,
            authUrl: userInfo.authUrl
        }
    }
}