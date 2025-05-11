import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DocumentProcessorService } from 'src/infraestructure/document/document-procesor.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const processor = app.get(DocumentProcessorService);
  await processor.procesarDocumentos();
  await app.close();
}

bootstrap();
