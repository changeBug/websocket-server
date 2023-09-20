import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user_token')
export class UserToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column()
    userId: number;

    @CreateDateColumn({ comment: '创建时间' })
    createdAt: Date;

    @Column({ default: false, comment: '是否永不过期' })
    isOpen: boolean;

    @Column({ default: 0, comment: '过期时间' })
    expirationTime: number;
}