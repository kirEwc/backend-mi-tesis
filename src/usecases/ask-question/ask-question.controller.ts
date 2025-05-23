// src/ask-question/ask-question.controller.ts
import { Controller, Post, Body, Res, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AskQuestionService } from './ask-question.service';
import { AskQuestionDto } from './dto/ask-question.dto';
import { Response } from 'express';
import { ChatService } from 'src/chat/chat.service';
import { MessageDto } from 'src/chat/dto/message.dto';

@ApiTags('ask-question')
@Controller('ask-question')
export class AskQuestionController {
  constructor(private readonly askQuestionService: AskQuestionService,
    private readonly chatService: ChatService
  ) {}

  @Post("/:idChat")
  @ApiOperation({ summary: 'Pregunta algo y recibe una respuesta generada por IA' })
  @ApiResponse({
    status: 200,
    description: 'Respuesta generada exitosamente',
    schema: {
      example: {
        respuesta: 'El aprendizaje automático es una rama de la inteligencia artificial...',
      },
    },
  })
  @ApiBadRequestResponse({ description: 'La pregunta es requerida' })
  async hacerPregunta(@Body() dto: AskQuestionDto ,@Param() idChat: number , @Res() res: Response) {
    const { pregunta } = dto;
    const respuesta = await this.askQuestionService.procesarPregunta(pregunta);
    const messageDto : MessageDto = {
      chatId : idChat,
      content : pregunta,
      response : respuesta
    }
    const message = await this.chatService.createNewMessage(messageDto);
    if(!message){
      return res.status(404).json({
        message: "El chat no esta registrado"
      })
    }
    return res.status(200).json({
      data: message
    })
  }
}
