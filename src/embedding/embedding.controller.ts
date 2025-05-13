import { Controller, Post, Body, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { EmbeddingService } from './embedding.service';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('embedding')
@Controller('embedding')
export class EmbeddingController {
  private readonly logger = new Logger(EmbeddingController.name);
  
  constructor(private readonly embeddingService: EmbeddingService) {}

  @ApiOperation({ summary: 'Genera embeddings para un texto dado' })
  @ApiResponse({ status: 200, description: 'Embeddings generados correctamente' })
  @ApiResponse({ status: 400, description: 'Texto de entrada inválido' })
  @ApiResponse({ status: 503, description: 'Servicio de embeddings no disponible' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          example: 'Texto para generar embeddings',
          description: 'Texto para el cual se generarán los embeddings'
        }
      },
      required: ['text']
    }
  })
  @Post('generate')
  async generateEmbeddings(@Body() body: { text: string }) {
    try {
      if (!body?.text) {
        throw new HttpException('Se requiere un texto para generar embeddings', HttpStatus.BAD_REQUEST);
      }
      
      this.logger.log(`Generando embeddings para texto de ${body.text.length} caracteres`);
      const embeddings = await this.embeddingService.generateEmbeddings(body.text);
      return embeddings;
    } catch (error) {
      this.logger.error(`Error al generar embeddings: ${error.message}`);
      
      // Manejar diferentes tipos de errores con códigos HTTP apropiados
      if (error instanceof HttpException) {
        throw error; // Reutilizar la excepción HTTP si ya está definida
      }
      
      // Errores de conectividad o servicio no disponible
      if (error.message.includes('No se puede conectar') || 
          error.message.includes('no está disponible') ||
          error.message.includes('No se recibió respuesta')) {
        throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
      }
      
      // Error de validación de entrada
      if (error.message.includes('texto de entrada')) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      
      // Cualquier otro error
      throw new HttpException(
        `Error al procesar la solicitud de embeddings: ${error.message}`, 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
