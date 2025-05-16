import { Injectable } from '@nestjs/common';
import { TfidfRetrieverService } from 'src/TFIDF/tfidf.service';
import { RespuestaService } from 'src/respuesta/respuesta.service';

@Injectable()
export class AskQuestionService {

    constructor(
        private readonly tfidfService: TfidfRetrieverService,
        private readonly respuestaService: RespuestaService,
      ) {}

async procesarPregunta(pregunta: string): Promise<string> {
    // 1. Obtener textos similares
    const resultados = this.tfidfService.query(pregunta, 5);

    // 2. Concatenar los textos como contexto
    const contexto = resultados.map(r => r.text).join('\n');

    // 3. Obtener respuesta de la IA
    const respuesta = await this.respuestaService.obtenerRespuesta(pregunta, contexto);

    return respuesta;
  }
    
}