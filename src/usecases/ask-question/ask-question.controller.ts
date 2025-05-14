// src/ask-question/ask-question.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AskQuestionService } from './ask-question.service';
import { AskQuestionDto } from './dto/ask-question.dto';

@ApiTags('ask-question')
@Controller('ask-question')
export class AskQuestionController {
  constructor(private readonly askQuestionService: AskQuestionService) {}

  @Post()
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
  async hacerPregunta(@Body() dto: AskQuestionDto) {
    const { pregunta } = dto;
    const respuesta = await this.askQuestionService.procesarPregunta(pregunta);
    return { respuesta };
  }
}
