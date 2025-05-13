// src/embedding/custom-embeddings.ts
import { Embeddings } from '@langchain/core/embeddings';
import { Injectable } from '@nestjs/common';
import { EmbeddingService } from './embedding.service';

@Injectable()
export class CustomEmbeddings extends Embeddings {
  constructor(private readonly embeddingService: EmbeddingService) {
    super({});
  }

  // LangChain exige este método
  async embedDocuments(texts: string[]): Promise<number[][]> {
    const results: number[][] = [];
    for (const text of texts) {
      const vector = await this.embeddingService.generateEmbeddings(text);
      results.push(vector.data[0].embedding); // Extraer el vector correctamente
    }
    return results;
  }

  // También se puede usar esto para búsquedas individuales
  async embedQuery(text: string): Promise<number[]> {
    return await this.embeddingService.generateEmbeddings(text);
  }
}
