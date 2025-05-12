import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';
import { Document } from 'langchain/document';

@Injectable()
export class PdfLoaderService {
  async loadPdfDocuments(): Promise<Document[]> {
    const pdfFolderPath = path.resolve(__dirname, '../../knowledgebase');
    const pdfFiles = fs.readdirSync(pdfFolderPath).filter(file => file.endsWith('.pdf'));

    const documents: Document[] = [];
    
    for (const file of pdfFiles) {
      const filePath = path.join(pdfFolderPath, file);
      const fileBuffer = fs.readFileSync(filePath);

      const pdfData = await pdfParse(fileBuffer);

      const content = pdfData.text;
      if (content) {
        const doc = new Document({
          pageContent: content,
          metadata: {
            source: file, // Nombre del archivo PDF como metadata
          },
        });
        documents.push(doc);
      }
    }

    return documents;
  }
}
