import { Injectable } from '@nestjs/common';
import { PROMPT } from './prompt';

@Injectable()
export class RespuestaService {
  async obtenerRespuesta(pregunta: string, context: string): Promise<string> {
    if (!pregunta || !context) {
      throw new Error('La pregunta y el contexto son requeridos');
    }

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "mistralai/mistral-small-3.1-24b-instruct:free",
        // "model": "deepseek/deepseek-r1:free",
        "messages": [
          {
            "role": "user",
            "content": `${PROMPT}\nPregunta: ${pregunta}\nContexto: ${context}`
          }
        ]
      })
    });

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Respuesta no válida del modelo de IA');
      }
      return data.choices[0].message.content;
    } catch (error) {
      if (error.message.includes('API')) {
        throw error;
      }
      throw new Error('Error al comunicarse con el modelo de IA: ' + error.message);
    }
  }
}