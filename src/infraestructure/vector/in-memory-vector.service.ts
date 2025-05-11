import { Injectable } from '@nestjs/common';

export type DocumentVector = {
  texto: string;
  vector: number[];
};

@Injectable()
export class InMemoryVectorService {
  private memory: DocumentVector[] = [];

  guardarVector(doc: DocumentVector) {
    this.memory.push(doc);
  }

  buscarContextoSimilar(vectorConsulta: number[], topK = 3): string[] {
    return this.memory
      .map((doc) => ({
        texto: doc.texto,
        similitud: cosineSimilarity(doc.vector, vectorConsulta),
      }))
      .sort((a, b) => b.similitud - a.similitud)
      .slice(0, topK)
      .map((doc) => doc.texto);
  }

  limpiar() {
    this.memory = [];
  }
}

// Función auxiliar de similitud coseno
function cosineSimilarity(vec1: number[], vec2: number[]): number {
  const dotProduct = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
  const normA = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
  const normB = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
  return dotProduct / (normA * normB || 1);
}
