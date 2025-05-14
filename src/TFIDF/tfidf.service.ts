// tfidf-retriever.service.ts
import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import * as natural from 'natural';
import * as pdfParse from 'pdf-parse';

@Injectable()
export class TfidfRetrieverService {
  private docsPath: string;
  private indexPath: string;
  private tfidfVectorizer: any;
  private texts: string[] = [];
  private tfidfMatrix: number[][] = [];
  private documentVectors: number[][] = [];

  constructor(docsPath: string = 'knowledgebase', indexPath: string = 'tfidf_index.json') {
    this.docsPath = docsPath;
    this.indexPath = indexPath;
    // Initializing the TF-IDF vectorizer from natural library
    this.tfidfVectorizer = new natural.TfIdf();
  }

  /**
   * Carga PDFs y los divide en fragmentos de tamaño específico
   */
  async loadAndSplit(chunkSize: number = 500): Promise<void> {
    const fragments: string[] = [];
    
    // Leer todos los archivos en el directorio
    const files = readdirSync(this.docsPath);
    
    for (const fname of files) {
      if (!fname.toLowerCase().endsWith('.pdf')) {
        continue;
      }
      
      const filePath = join(this.docsPath, fname);
      const dataBuffer = readFileSync(filePath);
      
      try {
        // Extraer texto del PDF
        const pdfData = await pdfParse(dataBuffer);
        const fullText = pdfData.text;
        
        // Fragmentar por tamaño fijo
        for (let i = 0; i < fullText.length; i += chunkSize) {
          fragments.push(fullText.slice(i, i + chunkSize));
        }
      } catch (error) {
        console.error(`Error al procesar ${fname}:`, error);
      }
    }
    
    this.texts = fragments;
    
    // Añadir cada fragmento al vectorizador TF-IDF
    fragments.forEach(fragment => {
      this.tfidfVectorizer.addDocument(fragment);
    });
  }

  /**
   * Genera la matriz TF-IDF y guarda el índice
   */
  index(): void {
    // Crear la matriz TF-IDF y los vectores de documentos
    const terms = Object.keys(this.tfidfVectorizer.documents[0] || {});
    this.documentVectors = [];
    
    // Para cada documento, crear un vector de sus valores TF-IDF
    for (let i = 0; i < this.texts.length; i++) {
      const docVector: number[] = [];
      
      terms.forEach(term => {
        const tfidf = this.tfidfVectorizer.tfidf(term, i);
        docVector.push(tfidf);
      });
      
      this.documentVectors.push(docVector);
    }
    
    // Guardar el índice
    const indexData = {
      terms: terms,
      documentVectors: this.documentVectors,
      texts: this.texts
    };
    
    writeFileSync(this.indexPath, JSON.stringify(indexData));
  }

  /**
   * Carga el índice previamente guardado
   */
  loadIndex(): void {
    const data = JSON.parse(readFileSync(this.indexPath, 'utf8'));
    
    // Reconstruir el vectorizador
    this.tfidfVectorizer = new natural.TfIdf();
    data.texts.forEach(text => {
      this.tfidfVectorizer.addDocument(text);
    });
    
    this.documentVectors = data.documentVectors;
    this.texts = data.texts;
  }

  /**
   * Calcula la distancia coseno entre dos vectores
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] ** 2;
      normB += vecB[i] ** 2;
    }
    
    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Vectoriza la consulta y busca los vecinos más cercanos
   */
  query(query: string, k: number = 5): Array<{ text: string; similarity: number }> {
    // Vectorizar la consulta
    const tempTfidf = new natural.TfIdf();
    tempTfidf.addDocument(query);
    
    const queryVector: number[] = [];
    const terms = Object.keys(this.tfidfVectorizer.documents[0] || {});
    
    terms.forEach(term => {
      // Obtener el valor TF-IDF para el término en la consulta
      const tfidf = tempTfidf.tfidf(term, 0);
      queryVector.push(tfidf);
    });
    
    // Calcular similitud con cada documento
    const similarities: Array<{ idx: number; similarity: number }> = [];
    
    this.documentVectors.forEach((docVector, idx) => {
      const similarity = this.cosineSimilarity(queryVector, docVector);
      similarities.push({ idx, similarity });
    });
    
    // Ordenar por similitud (descendente)
    similarities.sort((a, b) => b.similarity - a.similarity);
    
    // Devolver los k documentos más similares
    return similarities.slice(0, k).map(item => ({
      text: this.texts[item.idx],
      similarity: item.similarity
    }));
  }
}
