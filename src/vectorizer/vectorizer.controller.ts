import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { VectorizerService } from './vectorizer.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('vectorizer')
@Controller('vectorizer')
export class VectorizerController {
  private readonly logger = new Logger(VectorizerController.name);

  constructor(private readonly vectorizerService: VectorizerService) {}

  @Post('process')
  @ApiOperation({
    summary: 'Procesa documentos PDF y genera embeddings',
    description: 'Carga documentos PDF desde la carpeta knowledgebase, genera embeddings y los almacena en memoria',
  })
  @ApiResponse({
    status: 200,
    description: 'Documentos procesados exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        count: { type: 'number', example: 5, description: 'Número de documentos procesados' },
      },
    },
  })
  async processDocuments() {
    this.logger.log('Iniciando procesamiento de documentos');
    return await this.vectorizerService.vectorizeDocuments();
  }

  @Get('status')
  @ApiOperation({
    summary: 'Obtiene el estado actual del vectorizador',
    description: 'Devuelve información sobre la cantidad de documentos vectorizados',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del vectorizador',
    schema: {
      type: 'object',
      properties: {
        documentCount: { type: 'number', example: 5 },
      },
    },
  })
  getStatus() {
    const count = this.vectorizerService.getVectorCount();
    return { documentCount: count };
  }

  @Post('search')
  @ApiOperation({
    summary: 'Busca documentos relevantes',
    description: 'Busca documentos relevantes basados en una consulta de texto',
  })
  @ApiResponse({
    status: 200,
    description: 'Documentos relevantes encontrados',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          score: { type: 'number', example: 0.89, description: 'Puntuación de similitud' },
          documentId: { type: 'string', example: 'doc_1' },
          metadata: { type: 'object', example: { source: 'documento1.pdf', page: 1 } },
          content: { type: 'string', example: 'Contenido parcial del documento...' },
        },
      },
    },
  })
  async searchDocuments(@Body() body: { query: string; topK?: number }) {
    this.logger.log(`Recibida solicitud de búsqueda: ${body.query}`);
    return await this.vectorizerService.searchRelevantChunks(body.query, body.topK || 3);
  }
}