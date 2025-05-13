import { Controller, Post, Body, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { AskQuestionService } from './ask-question.service';
import { EmbeddingService } from '../embedding/embedding.service';
import { VectorizerService } from '../vectorizer/vectorizer.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

// DTO para la solicitud de pregunta
class AskQuestionDto {
  question: string;
}

@ApiTags('ask-question')
@Controller('ask-question')
export class AskQuestionController {
  private readonly logger = new Logger(AskQuestionController.name);

  constructor(
    private readonly askQuestionService: AskQuestionService,
    private readonly embeddingService: EmbeddingService,
    private readonly vectorizerService: VectorizerService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Hacer una pregunta y obtener una respuesta basada en contexto vectorizado' })
  @ApiBody({ type: AskQuestionDto })
  @ApiResponse({ status: 200, description: 'Respuesta generada exitosamente.', type: Object })
  @ApiResponse({ status: 400, description: 'Pregunta no proporcionada o inválida.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async askQuestion(@Body() askQuestionDto: AskQuestionDto): Promise<{ answer: string }> {
    const { question } = askQuestionDto;
    
    this.logger.log(`Recibida pregunta: "${question}"`);

    try {
      // 1. Vectorizar la pregunta
      this.logger.log('Vectorizando la pregunta...');
      const questionEmbedding = await this.embeddingService.generateEmbeddings(question);
      const questionVector = questionEmbedding.data[0].embedding;
      
      // 2. Buscar contexto relevante usando el vector de la pregunta
      this.logger.log('Buscando contexto relevante usando el vector de la pregunta...');
      const relevantChunks = await this.vectorizerService.searchRelevantChunks(question, 3, questionVector);
      
      let context = '';
      if (relevantChunks && relevantChunks.length > 0) {
        context = relevantChunks.map(chunk => chunk.content).join('\n\n---\n\n');
        this.logger.log(`Contexto encontrado (primeros 200 caracteres): ${context.substring(0, 200)}...`);
      } else {
        this.logger.warn('No se encontró contexto relevante. Se procederá sin contexto específico.');
      }

      // 3. Generar respuesta usando el contexto encontrado
      this.logger.log('Generando respuesta con el contexto encontrado...');
      const answer = await this.askQuestionService.generateAnswer(question, context);
      this.logger.log(`Respuesta generada.`);

      return { answer };
    } catch (error) {
      this.logger.error(`Error al procesar la pregunta: ${error.message}`, error.stack);
      throw new HttpException(
        error.message || 'Error al procesar la pregunta', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}