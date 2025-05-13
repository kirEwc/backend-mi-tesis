import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RespuestaService } from './respuesta.service';
import { PreguntaDto } from './dto/pregunta.dto';

@ApiTags('Respuesta')
@Controller('respuesta')
export class RespuestaController {
  constructor(private readonly respuestaService: RespuestaService) {}

  @Post('pregunta')
  @ApiOperation({ summary: 'Realiza una pregunta al modelo de IA' })
  @ApiResponse({ 
    status: 200, 
    description: 'Respuesta generada por el modelo',
    type: String
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos'
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor'
  })
  async hacerPregunta(@Body() preguntaDto: PreguntaDto): Promise<{ respuesta: string }> {
    try {
      const respuesta = await this.respuestaService.obtenerRespuesta(
        preguntaDto.pregunta,
        preguntaDto.contexto
      );
      return { respuesta };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al procesar la pregunta',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}