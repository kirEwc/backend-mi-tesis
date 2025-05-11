import { Module } from '@nestjs/common';
import { DocumentProcessorService } from './infraestructure/document/document-procesor.service';
import { EmbeddingProvider } from './infraestructure/embedding/embedding.provider';
import { InMemoryVectorService } from './infraestructure/vector/in-memory-vector.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    DocumentProcessorService,
    EmbeddingProvider,
    InMemoryVectorService,
  ],
})
export class AppModule {}
