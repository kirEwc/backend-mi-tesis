import { Injectable } from "@nestjs/common";
import { Chat } from "src/entity/chat.entity";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";
import { MessageDto } from "./dto/message.dto";
import { Message } from "src/entity/message.entity";

@Injectable()
export class ChatService{
    constructor(
        private chatRepository : Repository<Chat>,
        private userRepository : Repository<User>,
        private messageRepository: Repository<Message>
    )
    {}
    async createNewChat(userId: number) :Promise<Chat | null>{
        const User = await this.userRepository.findOne({where: {Userid : userId}});
        if(User){
            return null;
        }
        const newChat = this.chatRepository.create({
            user : User
        });
        await this.chatRepository.save(newChat);
        return newChat;
    }
    async getAllChats(userId: number) : Promise<Chat[]>{
        const chats = await this.chatRepository.find({    
            where : {user : {Userid : userId}},
            relations: ['User']
        });
        return chats;
    }
    async getChatById(chatId : number): Promise<Chat | null>{
        const chat = await this.chatRepository.findOne({
            where: {Chat_id: chatId},
            relations: ['Message']
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
        const newMessage = this.messageRepository.create(messageDto);
        await this.messageRepository.save(newMessage);
        return newMessage;
    }
    async DeleteChatById(idChat: number){
        const chat = await this.getChatById(idChat);
        if(chat){
            this.chatRepository.delete(chat);
        }
    }
}