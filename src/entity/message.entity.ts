import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chat } from "./chat.entity";

@Entity('Message')
export class Message{
    @PrimaryGeneratedColumn({type: 'bigint'})
    Message_id: number;
    @Column('text')
    content: string;
    @Column('text')
    response: string;
    @Column('timestamp')
    create_At : Date;
    @ManyToOne(() => Chat , chat => chat.message , {onDelete: 'CASCADE'})
    chat: Chat
}