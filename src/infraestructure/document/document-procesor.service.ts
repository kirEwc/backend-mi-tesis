import { Injectable } from '@nestjs/common';
import { EmbeddingProvider } from '../embedding/embedding.provider';
import { InMemoryVectorService } from '../vector/in-memory-vector.service';
import * as fs from 'fs';
import * as path from 'path';
import * as pdfParse from 'pdf-parse';

@Injectable()
export class DocumentProcessorService {
  private readonly folderPath = path.join(process.cwd(), 'knowledgebase');

  constructor(
    private readonly embeddingProvider: EmbeddingProvider,
    private readonly memory: InMemoryVectorService,
  ) {}

  async procesarDocumentos(): Promise<void> {
    const archivos = fs.readdirSync(this.folderPath).filter(f => f.endsWith('.pdf'));

    for (const archivo of archivos) {
      const ruta = path.join(this.folderPath, archivo);
      const buffer = fs.readFileSync(ruta);
      const data = await pdfParse(buffer);
      const texto = data.text.trim();

      if (!texto) {
        console.warn(`⚠️ ${archivo} no contiene texto.`);
        continue;
      }

      const vector = await this.embeddingProvider.embed(texto);
      this.memory.guardarVector({ texto, vector });
      console.log(`✅ Embedding cargado en memoria para ${archivo}`);
    }
  }
}
