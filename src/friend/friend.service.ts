import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { FriendReq } from "./friend-req.entity";
import { Friend } from "./friend.entity";


@Injectable()
export class FriendService {
    constructor(
        private readonly userService: UserService,
        @InjectRepository(Friend)
        private readonly fiendRepository: Repository<Friend>,
        @InjectRepository(FriendReq)
        private readonly friendReqRepository: Repository<FriendReq>,
    ) {}

    // 通过userId查找好友
    async findFriendByUserId(userId: number) {
        return this.fiendRepository.find({ where: { userId } });
    }

    // 添加好友
    async addFriend(userId: number, friendId: number) {
        return this.fiendRepository.save({
            userId,
            friendId
        })
    }

    // 发起加好友请求
    async sendFriendRequest(fromUserId: number, toUserId: number, msg?: string) {
        return this.friendReqRepository.save({
            fromUserId,
            toUserId,
            msg
        })
        
    }

    // 删除好友
    async deleteFriend(userId: number, friendId: number) {
        return this.fiendRepository.delete({ userId, friendId })
    }

    // 处理好友申请
    async handleFriendReq(fromUserId: number, toUserId: number) {
        return this.friendReqRepository.update({ fromUserId, toUserId }, { status: true })
    }
}