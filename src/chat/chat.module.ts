import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chat } from "src/entity/chat.entity";
import { User } from "src/entity/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Chat , User])
    ],
    controllers: [
        
    ],
    providers:[

    ]
})
export class ChatModule{}