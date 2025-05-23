import { Injectable, Logger } from '@nestjs/common';
import { PROMPT } from './prompt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RespuestaService {
  private readonly logger = new Logger(RespuestaService.name);

  constructor(private readonly httpService: HttpService) {}

  async obtenerRespuesta(pregunta: string, context: string): Promise<string> {
    if (!pregunta || !context) {
      throw new Error('La pregunta y el contexto son requeridos');
    }

    try {
      const prompt = `${PROMPT}\n\nContexto: ${context}\n\nPregunta: ${pregunta}\n\nRespuesta:`;
      
      const payload = {
        // model: 'qwen:0.5b',
        model: 'deepseek-r1:1.5b',
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          max_tokens: 1000
        }
      };

      this.logger.log('Enviando petición a Ollama...');
      this.logger.debug(`Payload: ${JSON.stringify(payload, null, 2)}`);

      const response = await firstValueFrom(
        this.httpService.post('http://localhost:11434/api/generate', payload)
      );

      this.logger.log('Respuesta recibida de Ollama');
      this.logger.debug(`Respuesta: ${JSON.stringify(response.data, null, 2)}`);

      if (!response.data || !response.data.response) {
        throw new Error('Respuesta no válida del modelo de IA');
      }

      return response.data.response.trim();
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error en obtenerRespuesta: ${error.message}`, error.stack);
        
        if ('response' in error) {
          const axiosError = error as unknown as { response: { status: number; statusText: string; data: any } };
          const status = axiosError.response?.status;
          const statusText = axiosError.response?.statusText;
          const body = axiosError.response?.data ? JSON.stringify(axiosError.response.data) : 'Sin detalles';
          
          throw new Error(
            `Error en la API de Ollama (${status} ${statusText}): ${body}`
          );
        }
      }
      
      throw new Error('Error al comunicarse con el modelo de IA: ' + (error as Error).message);
    }
  }
}
