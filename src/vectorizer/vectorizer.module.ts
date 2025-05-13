import { Module } from '@nestjs/common';
import { EmbeddingModule } from 'src/embedding/embedding.module';
import { PdfLoaderModule } from 'src/pdf-loader/pdf-loader.module';
import { VectorizerController } from './vectorizer.controller';
import { VectorizerService } from './vectorizer.service';

@Module({
  imports: [EmbeddingModule, PdfLoaderModule],
  controllers: [VectorizerController],
  providers: [VectorizerService],
  exports: [VectorizerService] // <--- AÑADIR ESTA LÍNEA
})
export class VectorizerModule {}
