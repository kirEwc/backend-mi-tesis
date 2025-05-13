import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { TfidfRetrieverService } from '../TFIDF/tfidf.service';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class InitService implements OnModuleInit {
  private readonly logger = new Logger(InitService.name);

  constructor(private readonly tfidfService: TfidfRetrieverService) {}

  /**
   * Este método se ejecuta automáticamente cuando el módulo se inicializa
   */
  async onModuleInit() {
    this.logger.log('Iniciando carga de documentos y creación de índice TFIDF...');
    
    try {
      // Verificar si existe la carpeta knowledgebase, si no, crearla
      const knowledgebasePath = join(process.cwd(), 'knowledgebase');
      if (!existsSync(knowledgebasePath)) {
        this.logger.log(`Creando directorio knowledgebase en: ${knowledgebasePath}`);
        mkdirSync(knowledgebasePath, { recursive: true });
        this.logger.warn('El directorio knowledgebase está vacío. Por favor, añade documentos PDF.');
        return;
      }

      // Cargar y dividir documentos
      this.logger.log('Cargando y dividiendo documentos...');
      await this.tfidfService.loadAndSplit(500);
      this.logger.log('Documentos cargados y divididos correctamente.');
      
      // Crear índice
      this.logger.log('Creando índice TFIDF...');
      this.tfidfService.index();
      this.logger.log('Índice TFIDF creado correctamente.');
      
      this.logger.log('Inicialización completada con éxito.');
    } catch (error) {
      this.logger.error(`Error durante la inicialización: ${error.message}`);
      this.logger.error(error.stack);
    }
  }
}