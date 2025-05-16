import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class PreguntaDto {
  @ApiProperty({
    description: 'La pregunta que se realizará al modelo de IA',
    example: '¿Cuál es el significado de la vida?'
  })
  @IsString()
  @IsNotEmpty()
  pregunta: string;

  @ApiProperty({
    description: 'Contexto adicional para la pregunta',
    example: 'Estoy buscando una respuesta filosófica'
  })
  @IsString()
  @IsNotEmpty()
  contexto: string;
}