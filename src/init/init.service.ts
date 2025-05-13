import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { VectorizerService } from '../vectorizer/vectorizer.service';

@Injectable()
export class InitService implements OnModuleInit {
  private readonly logger = new Logger(InitService.name);

  constructor(private readonly vectorizerService: VectorizerService) {}

  async onModuleInit() {
    this.logger.log('Iniciando vectorización automática de documentos...');
    try {
      const result = await this.vectorizerService.vectorizeDocuments();
      this.logger.log(`Vectorización completada: ${result.count} documentos procesados`);
    } catch (error) {
      this.logger.error('Error durante la vectorización automática:', error.message);
    }
  }
}