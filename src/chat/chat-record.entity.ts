import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

// 聊天记录表
@Entity()
export class ChatRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column({ comment: '好友id' })
    friendId: number;

    @Column({ default: '', nullable: false, comment: '消息' })
    msg: string;

    @CreateDateColumn({ comment: '创建时间' })
    createdAt: Date;

    @Column({ default: false, comment: '是否删除' })
    isDelete: boolean;

    @Column({ type: 'enum', enum: ['text', 'img', 'video', 'audio'], default: 'text', comment: '消息类型' })
    type: 'text' | 'img' | 'video' | 'audio';

    @Column({ default: false, comment: '是否已读' })
    isRead: boolean;
}