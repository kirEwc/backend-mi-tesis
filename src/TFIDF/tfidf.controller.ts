
// tfidf-retriever.controller.ts
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TfidfRetrieverService } from './tfidf.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('TFIDF')
@Controller('tfidf')
export class TfidfRetrieverController {
  constructor(private readonly tfidfService: TfidfRetrieverService) {}

  @Post('load')
  @ApiOperation({ summary: 'Carga documentos PDF y los divide en fragmentos' })
  @ApiBody({ schema: { properties: { chunkSize: { type: 'number', example: 500, description: 'Tamaño de los fragmentos en caracteres' } } } })
  @ApiResponse({ status: 200, description: 'Documentos cargados correctamente' })
  @ApiResponse({ status: 500, description: 'Error al cargar documentos' })
  async loadDocuments(@Body() body: { chunkSize?: number }) {
    const chunkSize = body.chunkSize || 500;
    await this.tfidfService.loadAndSplit(chunkSize);
    return { message: 'Documentos cargados correctamente' };
  }

  @Post('index')
  @ApiOperation({ summary: 'Crea el índice TFIDF a partir de los documentos cargados' })
  @ApiResponse({ status: 200, description: 'Índice creado correctamente' })
  @ApiResponse({ status: 500, description: 'Error al crear el índice' })
  createIndex() {
    this.tfidfService.index();
    return { message: 'Índice creado correctamente' };
  }

  @Get('query')
  @ApiOperation({ summary: 'Busca documentos similares a la consulta proporcionada' })
  @ApiQuery({ name: 'q', description: 'Consulta de búsqueda', type: String })
  @ApiQuery({ name: 'k', description: 'Número de resultados a devolver', type: Number, required: false, example: 3 })
  @ApiResponse({ status: 200, description: 'Resultados de la búsqueda', schema: { properties: { results: { type: 'array', items: { properties: { text: { type: 'string' }, similarity: { type: 'number' } } } } } } })
  @ApiResponse({ status: 500, description: 'Error al realizar la consulta' })
  search(@Query('q') query: string, @Query('k') k: number = 3) {
    try {
      // Intentar cargar el índice primero
      this.tfidfService.loadIndex();
      const results = this.tfidfService.query(query, k);
      return { results };
    } catch (error) {
      return { 
        error: 'Error al realizar la consulta',
        message: error.message
      };
    }
  }
}
