import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as dns from 'dns';
import { promisify } from 'util';
import { EmbeddingService } from '../embedding/embedding.service';
import { VectorizerService } from '../vectorizer/vectorizer.service';

dotenv.config();

@Injectable()
export class AskQuestionService  {
  private readonly logger = new Logger(AskQuestionService.name);
  private readonly ollamaEndpoint = 'http://localhost:11434/api/chat';
  
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly vectorizerService: VectorizerService,
  ) {}

  // Función para verificar la conectividad con el dominio
  private async checkDomainConnectivity(domain: string): Promise<boolean> {
    const lookup = promisify(dns.lookup);
    try {
      await lookup(domain);
      return true;
    } catch (error) {
      this.logger.error(`No se puede conectar al dominio ${domain}: ${error.message}`);
      return false;
    }
  }

  /**
   * Vectoriza una pregunta, busca contexto relevante y genera una respuesta
   * @param question Pregunta del usuario
   * @param context Contexto opcional (si ya se tiene)
   * @returns Respuesta generada
   */
  async generateAnswer(question: string, context?: string): Promise<string> {
    try {
      this.logger.log('Iniciando generación de respuesta con Ollama (modelo qwen:0.5b)');
      this.logger.log(`Contexto: ${context}`);
      
      // Verificar que el texto no esté vacío
      if (!question || question.trim() === '') {
        throw new Error('La pregunta no puede estar vacía');
      }
      
      // Verificar conectividad con el servidor local de Ollama
      const domain = 'localhost';
      const isConnected = await this.checkDomainConnectivity(domain);
      
      if (!isConnected) {
        throw new Error(`No se puede conectar al servidor local de Ollama (${domain}). Verifique que Ollama esté en ejecución.`);
      }
      
      // Si no se proporciona contexto, buscar contexto relevante
      if (!context || context.trim() === '') {
        this.logger.log('No se proporcionó contexto. Vectorizando pregunta y buscando contexto relevante...');
        
        try {
          // Vectorizar la pregunta
          const questionEmbedding = await this.embeddingService.generateEmbeddings(question);
          const questionVector = questionEmbedding.data[0].embedding;
          
          // Buscar contexto relevante usando el vector de la pregunta
          const relevantChunks = await this.vectorizerService.searchRelevantChunks(question, 3, questionVector);
          
          if (relevantChunks && relevantChunks.length > 0) {
            context = relevantChunks.map(chunk => chunk.content).join('\n\n---\n\n');
            this.logger.log(`Contexto encontrado automáticamente (primeros 200 caracteres): ${context.substring(0, 200)}...`);
          } else {
            this.logger.warn('No se encontró contexto relevante. Se procederá sin contexto específico.');
            context = 'No hay información específica disponible para esta pregunta.';
          }
        } catch (error) {
          this.logger.error(`Error al buscar contexto: ${error.message}`);
          context = 'No se pudo obtener contexto debido a un error interno.';
        }
      }

      const messages = [
        {
          role: 'system',
          content:
            'Solo vas a responder usando la información proporcionada en el contexto. Si no sabes la respuesta, di que no tienes suficiente información.',
        },
        {
          role: 'user',
          content: `Contexto:\n${context}\n\nPregunta: ${question}`,
        },
      ];

      try {
        const response = await axios.post(
          this.ollamaEndpoint,
          {
            model: 'qwen:0.5b',
            messages,
            stream: false
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        // Verificar que la respuesta contiene datos
        if (!response.data || !response.data.message || typeof response.data.message.content !== 'string') {
          throw new Error('La API de Ollama no devolvió una respuesta válida');
        }
        
        return response.data.message.content;
      } catch (error) {
        this.logger.error('Error al generar respuesta:', error);
        
        // Proporcionar mensajes de error más descriptivos
        if (error.response) {
          // La solicitud fue realizada y el servidor respondió con un código de estado
          // que cae fuera del rango de 2xx
          this.logger.error('Error response data:', error.response.data);
          this.logger.error('Error response status:', error.response.status);
          
          // Verificar si es un error 404 (modelo no encontrado)
          if (error.response.status === 404) {
            throw new Error(
              'El modelo qwen:0.5b no está disponible en Ollama. Asegúrese de haberlo descargado con el comando: ollama pull qwen:0.5b' 
            );
          }
          
          throw new Error(`Error del servidor Ollama: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
          // La solicitud fue realizada pero no se recibió respuesta
          throw new Error('No se recibió respuesta del servidor Ollama. Verifique que Ollama esté en ejecución.');
        } else {
          // Algo ocurrió al configurar la solicitud que desencadenó un error
          throw new Error(`Error al generar respuesta: ${error.message}`);
        }
      }
    } catch (error) {
      this.logger.error(`Error general al generar respuesta: ${error.message}`, error.stack);
      
      // Proporcionar mensajes de error más específicos según el tipo de error
      if (error.message && error.message.includes('No se puede conectar')) {
        return 'Error de conexión con Ollama. Verifique que el servicio esté en ejecución.';
      } else if (error.message && error.message.includes('qwen:0.5b no está disponible')) {
        return 'El modelo qwen:0.5b no está disponible en Ollama. Asegúrese de haberlo descargado con el comando: ollama pull qwen:0.5b';
      }
      
      return 'Lo siento, ocurrió un error al procesar tu pregunta. Por favor, intenta nuevamente más tarde.';
    }
  }
}
