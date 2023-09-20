import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Friend {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column({ comment: '好友id' })
    friendId: number;

    @Column({ default: '', nullable: false, comment: '备注', length: 50 })
    remark: string;

    @CreateDateColumn({ comment: '创建时间' })
    createdAt: Date;
}