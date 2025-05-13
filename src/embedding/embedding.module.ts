import { Module } from '@nestjs/common';
import { EmbeddingService } from './embedding.service';
import { EmbeddingController } from './embedding.controller';
import { CustomEmbeddings } from './customEmbeddig';

@Module({
  controllers: [EmbeddingController],
  providers: [EmbeddingService, CustomEmbeddings],
  exports: [EmbeddingService],
})
export class EmbeddingModule {}
