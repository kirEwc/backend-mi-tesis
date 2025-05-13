import { Injectable, Logger } from '@nestjs/common';
import { PdfLoaderService } from 'src/pdf-loader/pdf-loader.service';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { cosineSimilarity } from 'src/utils/similarity';

interface DocumentVector {
  documentId: string;
  metadata: any;
  embedding: number[];
  content: string;
}

@Injectable()
export class VectorizerService {
  private readonly logger = new Logger(VectorizerService.name);
  private documentVectors: DocumentVector[] = [];

  constructor(
    private readonly pdfLoaderService: PdfLoaderService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  /**
   * Carga documentos PDF, genera embeddings y los almacena en memoria
   */
  async vectorizeDocuments(): Promise<{ success: boolean; count: number }> {
    try {
      // Limpiar vectores anteriores
      this.documentVectors = [];
      
      // Cargar documentos PDF
      this.logger.log('Cargando documentos PDF...');
      const documents = await this.pdfLoaderService.loadPdfDocuments();
      this.logger.log(`Se cargaron ${documents.length} documentos PDF`);
      
      // Generar embeddings para cada documento
      this.logger.log('Generando embeddings para los documentos...');
      
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        try {
          // Generar embedding para el contenido del documento
          const embeddingResult = await this.embeddingService.generateEmbeddings(doc.pageContent);
          
          // Almacenar documento con su embedding
          this.documentVectors.push({
            documentId: `doc_${i}`,
            metadata: doc.metadata,
            embedding: embeddingResult.data[0].embedding,
            content: doc.pageContent
          });
          
          this.logger.log(`Embedding generado para documento ${doc.metadata.source}`);
        } catch (error) {
          this.logger.error(`Error al generar embedding para documento ${doc.metadata.source}: ${error.message}`);
        }
      }
      
      this.logger.log(`Vectorización completada. ${this.documentVectors.length} documentos vectorizados`);
      return { 
        success: true, 
        count: this.documentVectors.length 
      };
    } catch (error) {
      this.logger.error(`Error en el proceso de vectorización: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtiene todos los vectores de documentos almacenados
   */
  getAllDocumentVectors(): DocumentVector[] {
    return this.documentVectors;
  }

  /**
   * Obtiene la cantidad de vectores almacenados
   */
  getVectorCount(): number {
    return this.documentVectors.length;
  }

  /**
   * Hace una búsqueda de similitud entre la consulta y los documentos vectorizados
   * @param query Texto de consulta para buscar documentos similares
   * @param topK Número de resultados más relevantes a devolver
   * @returns Array con los documentos más relevantes y su puntuación de similitud
   */
  async searchRelevantChunks(query: string, topK = 3) {
    this.logger.log(`Buscando documentos relevantes para la consulta: "${query}"`);
    
    // Verificar si hay documentos vectorizados
    if (this.documentVectors.length === 0) {
      this.logger.warn('No hay documentos vectorizados para realizar la búsqueda');
      return [];
    }
    
    // Generar embedding para la consulta
    const queryEmbedding = await this.embeddingService.generateEmbeddings(query);
    const queryVector = queryEmbedding.data[0].embedding;
  
    // Calcular similitud con cada documento
    const similarities = this.documentVectors.map((entry) => {
      const score = cosineSimilarity(queryVector, entry.embedding);
      return { 
        score, 
        documentId: entry.documentId,
        metadata: entry.metadata,
        content: entry.content.substring(0, 200) + (entry.content.length > 200 ? '...' : '') // Incluir parte del contenido para validación
      };
    });
  
    // Ordenar por similitud descendente
    const sorted = similarities.sort((a, b) => b.score - a.score);
    const results = sorted.slice(0, topK);
    
    this.logger.log(`Se encontraron ${results.length} documentos relevantes`);
    return results;
  }
}