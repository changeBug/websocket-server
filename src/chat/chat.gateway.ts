import { UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FriendService } from 'src/friend/friend.service';
import { UserService } from 'src/user/user.service';
import { ChatRecordService } from './chat-record.service';
import { WsAuthGuard } from './ws-guard';
import moment from 'moment';

@WebSocketGateway()
export class ChatGateway {
    constructor(
        private readonly userService: UserService,
        private readonly friendService: FriendService,
        private readonly chatRecordService: ChatRecordService
    ) {}

    // 登录之后获取配置
    async initData(userId: number, client: Socket) {
        const chatList = await this.chatRecordService.findChatRecord(userId);
        client.emit('chatList', chatList);
    }

    @WebSocketServer()
    server: Server;
    private connectedClients = new Set<Number>();
    async handleConnection(client: Socket) {
        const userId = client.handshake.query.userId as string;
        const user = await this.userService.getUserById(Number(userId));
        if (!user) {
            client.disconnect(true);
        }
        this.connectedClients.add(user.id);
        this.updateOnlineCount();
        await this.initData(user.id, client);
        client.join('1');
        this.server.to('1').emit('message', {
            userInfo: { id: user.id, name: user.name, authUrl: user.authUrl },
            msg: `欢迎${user.name}加入群聊`,
            type: 'notify',
            room: '1'
        });
    }

    handleDisconnect(client: Socket) {
        this.handleLeaveGroup(client);
    }

    private updateOnlineCount() {
        const onlineCount = this.connectedClients.size;
        
        this.server.emit('onlineCount', onlineCount); // 发送在线人数到所有客户端
    }

    @SubscribeMessage('chat')
    @UseGuards(WsAuthGuard)
    async handleMessage(client: Socket, message: string) {
        const userId = client.handshake.query.userId as string;
        const user = await this.userService.getUserById(Number(userId));
        if (!user) {
            client.disconnect(true);
        }
        this.server.to('1').emit('message', { 
            userInfo: user,
            msg: message,
            type: 'msg',
            room: '1'
        });
    }

    @SubscribeMessage('leaveGroup')
    async handleLeaveGroup(client: Socket) {
        const userId = client.handshake.query.userId as string;
        const user = await this.userService.getUserById(Number(userId));
        if (!user) {
            client.disconnect(true);
        }
        this.connectedClients.delete(user.id);
        this.updateOnlineCount();
        this.server.to('1').emit('message', {
            userInfo: user,
            msg: `${user.name}离开了群聊`,
            type: 'notify',
            room: '1'
        });
        client.leave('1');
    }
}