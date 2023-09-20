import { Body, Controller, Get, Param, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { sha256, saveFile } from "src/utils";
import { User } from "./user.entity";
import { UserService } from "./user.service";

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    // 请求图形验证码
    @Get('captcha')
    getCaptcha(@Req() req: any) {
        const captcha = this.userService.generateCaptcha();
        if (captcha) {
            req.session.captcha = captcha.text;
        }
        return captcha.data;
    }
    // 注册
    @Post('register')
    async register(
        @Body('phone') phone: string,
        @Body('pwd') pwd: string,
        @Body('captcha') captcha: string,
        @Body('name') name: string,
        @Req() req: any
    ) {
        try {
            if (! phone || ! pwd || ! captcha || !name) {
                throw new Error('缺少参数');
            }
            if (req.session.captcha.toUpperCase() !== captcha.toUpperCase()) {
                throw new Error('验证码错误');
            }
            const user = await this.userService.getUserByPhone(phone);
            if (user) {
                throw new Error('手机号已被注册');
            }
            const result = await this.userService.saveUser(phone, sha256(pwd), name);
            return {
                code: 0,
                data: result
            };
        } catch (error) {
            return {
                code: 1,
                msg: error.message
            };
        }
    }
    // 登录
    @Post('login')
    async login(
        @Body('phone') phone: string,
        @Body('pwd') pwd: string,
        @Body('captcha') captcha: string,
        @Req() req: any
    ) {
        try {
            if (! phone || ! pwd) {
                throw new Error('缺少参数');
            }
            if (req.session.captcha.toUpperCase() !== captcha.toUpperCase()) {
                throw new Error('验证码错误');
            }
            const result = await this.userService.login(phone, sha256(pwd));
            return {
                code: 0,
                data: result
            };
        } catch (error) {
            return {
                code: 1,
                msg: error.message
            }
        }
    }

    // 上传图片
    @Post('upload')
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @UploadedFile() file: any,
        @Req() req: any
    ) {
        try {
            if (!file) {
                throw new Error('缺少参数');
            }
            const fileType = file.originalname.split('.')[1];
            if (!fileType) {
                throw new Error(`未知类型，请上传jpg,png,gif, mp4等格式`);
            }
            return {
                code: 0,
                data: await saveFile(file.buffer, fileType, req.user.id)
            }
        } catch (error) {
            return {
                code: 1,
                msg: error.message
            }
        }
    }

    // 更新用户信息
    @Post('update')
    @UseGuards(AuthGuard())
    async update(
        @Req() req: any,
        @Body('name') name?: string,
        @Body('authUrl') authUrl?: string,
        @Body('password') password?: string
    ) {
        try {
            const user: User = { ...req.user };
            if (name) {
                user['name'] = name;
            }
            if (authUrl) {
                user['authUrl'] = authUrl;
            }
            if (password) {
                user['password'] = sha256(password);
            }
            const result = await this.userService.updateUser(user);
            return {
                code: 0,
                data: result
            }
        } catch (error) {
            return {
                code: 1,
                msg: error.message
            }
        }
    }

    // 查找用户
    @Get(':userId')
    @UseGuards(AuthGuard())
    async find(
        @Param('userId') userId: string
    ) {
        return this.userService.getUserById(Number(userId));
    }
}