import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PdfLoaderService } from './pdf-loader.service';

@Controller()
export class PdfLoaderController {
  constructor(private readonly pdfLoaderService: PdfLoaderService) {}

  @Get('load-pdfs')
  @ApiOperation({
    summary: 'Cargar los PDFs desde la carpeta knowledgebase',
    description: 'Este endpoint carga todos los PDFs ubicados en la carpeta "knowledgebase" y extrae su contenido.',
  })
  @ApiResponse({
    status: 200,
    description: 'PDFs cargados exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string', description: 'Nombre del archivo PDF' },
          contentPreview: { type: 'string', description: 'Fragmento del contenido del PDF' },
        },
      },
    },
  })
  async loadPdfs() {
    const documents = await this.pdfLoaderService.loadPdfDocuments();
    return documents.map(doc => ({
      source: doc.metadata.source,
      contentPreview: doc.pageContent.slice(0, 100), // Mostramos solo un fragmento del contenido
    }));
  }
}
