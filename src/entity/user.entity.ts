import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Chat } from "./chat.entity";

@Entity('User')
export class User{
@PrimaryGeneratedColumn({type: 'bigint'})
Userid : number;
@Column()
Email: string;
@Column()
Name: string;
@Column('timestamp')
created_At : Date
@OneToMany(()=> Chat , chat => chat.user)
Chat: Chat[];
}

