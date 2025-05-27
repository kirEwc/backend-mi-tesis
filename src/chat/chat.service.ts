import { Injectable } from "@nestjs/common";
import { Chat } from "src/entity/chat.entity";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";
import { MessageDto } from "./dto/message.dto";
import { Message } from "src/entity/message.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ChatService{
    constructor(
        @InjectRepository(Chat)
        private chatRepository : Repository<Chat>,
        @InjectRepository(User)
        private userRepository : Repository<User>,
        @InjectRepository(Message)
        private messageRepository: Repository<Message>
    )
    {}
    async createNewChat(userId: number) :Promise<Chat | null>{
        const User = await this.userRepository.findOne({where: {Userid : userId}});
        if(User === null){
            return null;
        }
        const newChat = this.chatRepository.create({
            user : User,
            Create_At: new Date() // Añadir la fecha actual
        });
        await this.chatRepository.save(newChat);
        return newChat;
    }
    async getAllChats(userId: number) : Promise<Chat[]>{
        const chats = await this.chatRepository.find({    
            where : {user : {Userid : userId}},
            relations: ['user'] // Cambiado de 'User' a 'user'
        });
        return chats;
    }
    async getChatById(chatId : number): Promise<Chat | null>{
        const chat = await this.chatRepository.findOne({
            where: {Chat_id: chatId},
            relations: ['message'] // Cambiado de 'Message' a 'message'
        })
        if(!chat){
            return null;
        }
        return chat;
    }
    async createNewMessage(messageDto : MessageDto ): Promise<Message | null>{
        const chat = await this.chatRepository.findOne({
            where: {Chat_id: messageDto.chatId}
        }
        )
        if(!chat){
            return null;
        }
        const newMessage = this.messageRepository.create({
            ...messageDto,
            create_At: new Date(),
            chat: chat
        });
        await this.messageRepository.save(newMessage);
        return newMessage;
    }
    async DeleteChatById(idChat: number) : Promise<Chat | null>{
        const chat = await this.getChatById(idChat);
        console.log(chat);
        if(chat){
            this.chatRepository.delete(idChat);
            return chat;
        }
        return null;
    }
}