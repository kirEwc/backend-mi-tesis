import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AskDto {
  @ApiProperty({ 
    example: '¿Cuál es el proceso de inscripción?', 
    description: 'La pregunta del usuario',
    type: String 
  })
  @IsString()
  @IsNotEmpty()
  question: string;
}