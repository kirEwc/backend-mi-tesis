import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as dns from 'dns';
import { promisify } from 'util';

// Cargar variables de entorno
dotenv.config();

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  // URL para la API local de Ollama
  private readonly ollamaEndpoint = 'http://localhost:11434/api/embeddings';
  
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

  async generateEmbeddings(text: string): Promise<any> {
    try {
      // Verificar que el texto no esté vacío
      if (!text || text.trim() === '') {
        throw new Error('El texto de entrada no puede estar vacío');
      }

      this.logger.log('Generando embeddings con el modelo nomic-embed-text de Ollama...');
      
      // Verificar conectividad con el servidor local de Ollama
      const domain = 'localhost';
      const isConnected = await this.checkDomainConnectivity(domain);
      
      if (!isConnected) {
        throw new Error(`No se puede conectar al servidor local de Ollama (${domain}). Verifique que Ollama esté en ejecución.`);
      }

      // Realizar la solicitud a la API local de Ollama
      try {
        const response = await axios.post(
          this.ollamaEndpoint, 
          {
            model: 'nomic-embed-text',
            prompt: text
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        // Verificar que la respuesta contiene datos
        if (!response.data || !response.data.embedding) {
          throw new Error('La API de Ollama no devolvió datos de embeddings');
        }

        // Formatear la respuesta para mantener compatibilidad con el resto del sistema
        return {
          model: 'nomic-embed-text',
          data: [{
            embedding: response.data.embedding,
            index: 0,
            object: 'embedding'
          }],
          object: 'list',
          usage: {
            prompt_tokens: text.length,
            total_tokens: text.length
          }
        };
      } catch (error) {
        this.logger.error('Error generating embeddings:', error);
        
        // Proporcionar mensajes de error más descriptivos
        if (error.response) {
          // La solicitud fue realizada y el servidor respondió con un código de estado
          // que cae fuera del rango de 2xx
          this.logger.error('Error response data:', error.response.data);
          this.logger.error('Error response status:', error.response.status);
          
          // Verificar si es un error 404 (modelo no encontrado)
          if (error.response.status === 404) {
            throw new Error(
              'El modelo nomic-embed-text no está funcionando correctamente. ' 
            );
          }
          
          throw new Error(`Error del servidor Ollama: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
          // La solicitud fue realizada pero no se recibió respuesta
          throw new Error('No se recibió respuesta del servidor Ollama. Verifique que Ollama esté en ejecución.');
        } else {
          // Algo ocurrió al configurar la solicitud que desencadenó un error
          throw new Error(`Error al generar embeddings: ${error.message}`);
        }
      }
    } catch (error) {
      this.logger.error(`Error general al generar embeddings: ${error.message}`);
      throw error;
    }
  }
}
