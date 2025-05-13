import { Module } from '@nestjs/common';
import { PdfLoaderModule } from './pdf-loader/pdf-loader.module';
import { PdfLoaderService } from './pdf-loader/pdf-loader.service';
import { PdfLoaderController } from './pdf-loader/pdf-loader.controller';
import { EmbeddingService } from './embedding/embedding.service';
import { EmbeddingModule } from './embedding/embedding.module';
import { EmbeddingController } from './embedding/embedding.controller';
import { VectorizerModule } from './vectorizer/vectorizer.module';
import { AskQuestionModule } from './ask-question/ask-question.module'; // <--- AÑADIR ESTA LÍNEA
import { ChatModule } from './chat/chat.module'; // <--- AÑADIR ESTA LÍNEA

@Module({
  imports: [ 
    PdfLoaderModule,
    EmbeddingModule,
    VectorizerModule,
    AskQuestionModule, // <--- AÑADIR ESTA LÍNEA
    ChatModule,       // <--- AÑADIR ESTA LÍNEA
   ],
  controllers: [
    PdfLoaderController,
    EmbeddingController
    // ChatController está en ChatModule
    // VectorizerController está en VectorizerModule
  ],
  providers: [ 
    PdfLoaderService, // Estos son servicios que AppModule podría estar proveyendo directamente o re-exportando.
    EmbeddingService  // Si son provistos por sus propios módulos y esos módulos son importados, no necesitan estar aquí.
                      // Por ahora, los mantendré como estaban en tu archivo original.
   ],
})
export class AppModule {}
