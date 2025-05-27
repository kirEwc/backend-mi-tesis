import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chat } from "src/entity/chat.entity";
import { User } from "src/entity/user.entity";
import { Message } from "src/entity/message.entity";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([Chat, User, Message])
    ],
    controllers: [
        ChatController
    ],
    providers:[
        ChatService
    ],
    exports:[
        ChatService
    ]
})
export class ChatModule{}