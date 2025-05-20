import { Body, Controller, Delete, Get, Param, Post, Res } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { ChatService } from "./chat.service";

ApiTags('Chat')
Controller('Chat')
export class ChatController{
    constructor(
        private chatService : ChatService
    ){}
    @Post()
    @ApiOperation({summary: "Endpoint para crear un nuevo Chat"})
    async CreateChat(@Body() idUser: number , @Res() res: Response){
        const chat = await this.chatService.createNewChat(idUser);
        if(!chat){
            return res.status(404).json({
                message: "El usuario no esta registrado"
            });
        }
        return res.status(200).json({
            message: "Nuevo chat creado con exito"
        })
    }
    @Get("/:idUser")
    @ApiOperation({summary: "Obtener todos los chats del usuario"})
    async GetAllChat(@Param() idUser: number , @Res() res: Response){
        const chats = await this.chatService.getAllChats(idUser);
        return res.status(200).json({
            data: chats
        });
    }
    @Get(`GetMessagesByChat/:idChat`)
    @ApiOperation({summary: "Obtener todos los mensajes de un chat"})
    async GetAllMessageByChat(@Param() idChat: number , @Res() Res: Response){
        const chat = this.chatService.getChatById(idChat);
        if(!chat){
            return Res.status(404).json({
                message: `El chat con id ${idChat} no se encuentra `
            })
        }
        return Res.status(200).json({
            data: chat
        })
    }
    @Delete("/:idChat")
    @ApiOperation({summary: "Eliminar un chat por su identificador"})
    async DeleteChat(@Param() idChat: number , @Res() res: Response){
        await this.chatService.DeleteChatById(idChat);
        return res.status(200).json({
            message: "El chat y los mensajes asociados a el han sido eliminados "
        })
    }
}