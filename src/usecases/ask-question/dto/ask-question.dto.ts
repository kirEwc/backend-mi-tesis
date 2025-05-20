// src/ask-question/dto/ask-question.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AskQuestionDto {
  @ApiProperty({
    description: 'Pregunta que el usuario quiere hacer',
    example: '¿Qué es el aprendizaje automático?',
  })
  @IsString()
  @IsNotEmpty()
  pregunta: string;

  
}
