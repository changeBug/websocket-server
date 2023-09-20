import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { UserService } from "src/user/user.service";


@Injectable()
export class WsAuthGuard implements CanActivate {
    constructor(
        private readonly userService: UserService
    ) {}
    async canActivate(context: ExecutionContext) {
        const client: Socket = context.switchToWs().getClient();
        const token = client.handshake.query.token as string;
        if (!token) {
            client.emit('error', `您还没有登录,请先登录!`);
            return false;
        }
        const user = await this.userService.validateUser(token);
        if (!user) {
            client.emit('error', '您还没有登录,请先登录!');
            return false;
        }
        return true;
    }
}