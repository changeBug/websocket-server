import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '', nullable: false, length: 11, comment: '用户手机号' })
    phone: string;

    @Column({ default: '', nullable: false, comment: '密码' })
    password: string;

    @Column({ default: '', nullable: false, comment: '昵称' })
    name: string;

    @Column({ default: '' })
    authUrl: string;

    @CreateDateColumn({ comment: '创建时间' })
    createdAt: Date;
}