import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

// 好友请求表
@Entity()
export class FriendReq {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ comment: '请求人id' })
    fromUserId: number;

    @Column({ comment: '被请求人id' })
    toUserId: number;

    @Column({ default: '', comment: '发送的信息' })
    msg: string;

    @Column({ default: false, comment: '是否处理' })
    status: boolean;

    // 创建时间
    @CreateDateColumn({ comment: '创建时间' })
    createdAt: Date;

}