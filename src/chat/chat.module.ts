import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chat } from "src/entity/chat.entity";
import { User } from "src/entity/user.entity";
import { Message } from "src/entity/message.entity";
import { ChatService } from "./chat.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Chat, User, Message])
    ],
    controllers: [
        
    ],
    providers:[
        ChatService
    ],
    exports:[
        ChatService
    ]
})
export class ChatModule{}