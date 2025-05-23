import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Message } from "./message.entity";

@Entity('Chat')
export class Chat{
    @PrimaryGeneratedColumn({type : 'bigint'})
    Chat_id: number;
    @Column('timestamp')
    Create_At: Date;
    @ManyToOne(() => User , user => user.Chat)
    user: User;
    @OneToMany(() => Message , message => message.chat)
    message: Message[]
}