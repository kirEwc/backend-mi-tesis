import { Controller, Post, Body, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { AskQuestionService } from '../ask-question/ask-question.service';
import { VectorizerService } from '../vectorizer/vectorizer.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AskDto } from './dto/ask.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(
    private readonly askQuestionService: AskQuestionService,
    private readonly vectorizerService: VectorizerService,
  ) {}

  @Post('ask')
  @ApiOperation({ summary: 'Hacer una pregunta y obtener una respuesta basada en contexto' })
  @ApiBody({ type: AskDto })
  @ApiResponse({ status: 200, description: 'Respuesta generada exitosamente.', type: Object }) // Ajusta el 'type' según la estructura de tu respuesta
  @ApiResponse({ status: 400, description: 'Pregunta no proporcionada o inválida.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async ask(@Body() askDto: AskDto): Promise<{ answer: string }> {
    const { question } = askDto;
    // La validación de DTO se maneja automáticamente por ValidationPipe si está configurado

    this.logger.log(`Recibida pregunta: "${question}"`);

    try {
      this.logger.log('Buscando contexto relevante...');
      const relevantChunks = await this.vectorizerService.searchRelevantChunks(question, 3); // topK = 3 por defecto
      
      let context = '';
      if (relevantChunks && relevantChunks.length > 0) {
        context = relevantChunks.map(chunk => chunk.content).join('\n\n---\n\n');
        this.logger.log(`Contexto encontrado (primeros 200 caracteres): ${context.substring(0, 200)}...`);
      } else {
        this.logger.warn('No se encontró contexto relevante. Se procederá sin contexto específico.');
        // El prompt de AskQuestionService está configurado para indicar si no hay suficiente información.
      }

      this.logger.log('Generando respuesta...');
      const answer = await this.askQuestionService.generateAnswer(question, context);
      this.logger.log(`Respuesta generada.`);

      return { answer };
    } catch (error) {
      this.logger.error(`Error al procesar la pregunta: ${error.message}`, error.stack);
      // Considera si quieres exponer error.message o un mensaje genérico
      throw new HttpException(error.message || 'Error al procesar la pregunta', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}