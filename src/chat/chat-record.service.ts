import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatRecord } from "./chat-record.entity";
import moment from "moment";

@Injectable()

export class ChatRecordService {
    constructor(
        @InjectRepository(ChatRecord)
        private readonly chatRecordRepository: Repository<ChatRecord>
    ) {}


    // 保存聊天记录
    async saveChatRecord(chatRecord: ChatRecord) {
        return this.chatRecordRepository.save(chatRecord);
    }

    // 查询与好友聊天记录
    async findChatRecordByUserId(userId: number, friendId: number) {
        return this.chatRecordRepository.find({ 
            where: { userId, friendId, isDelete: false },
            order: { createdAt: 'DESC' }
        });
    }

    // 删除某条聊天记录
    async deleteChatRecordById(id: number) {
        return this.chatRecordRepository.update(id, { isDelete: true });
    }

    // 更改聊天记录为已读
    async updateChatRecordById(ids: number[]) {
        return this.chatRecordRepository.update(ids, { isRead: true });
    }

    // 查询用户相关聊天记录
    async findChatRecord(userId: number) {
        let messages = await this.chatRecordRepository.createQueryBuilder('chatRecord')
            .select([
                'chatRecord.id', 'chatRecord.userId', 'chatRecord.friendId', 'chatRecord.msg',
                'chatRecord.createdAt', 'chatRecord.isDelete', 'chatRecord.type', 'chatRecord.isRead',
                'user.name', 'friend.name as friendName', 'user.authUrl', 'friend.authUrl as friendAuthUrl'
            ])
            .leftJoin('user', 'user', 'chatRecord.userId = user.id')
            .leftJoin('user', 'friend', 'chatRecord.friendId = friend.id')
            .where('chatRecord.isDelete = :isDelete', { isDelete: false })
            .andWhere('chatRecord.userId = :userId or chatRecord.friendId = :userId', { userId })
            .orderBy('chatRecord.createdAt', 'DESC')
            .getRawMany();
        // 处理格式
        messages = messages.map(o => {
            const data = {};
            Object.keys(o).map(key => data[
                key.includes('_') ? key.split('_')[1] : key
            ] = o[key]);
            return data;
        })
        
        // 保存聊天的列表
        const records = [];
        // 保存聊天的两个人的Id
        const userIds = [];
        messages.map(o => {
            const ids = userIds.find(ids => 
                (ids[0] === o.userId && ids[1] === o.friendId) ||
                (ids[0] === o.friendId && ids[1] === o.userId)
            )
            if (!ids) {
                userIds.push([o.userId, o.friendId]);
            }
        });
        for (const ids of userIds) {
            const matchingMessage = messages.filter(m =>
                (m.userId === ids[0] && m.friendId === ids[1]) ||
                (m.userId === ids[1] && m.friendId === ids[0])
            );

            if (matchingMessage) {
                records.push(matchingMessage);
            }
        }
        return records;
    }
}