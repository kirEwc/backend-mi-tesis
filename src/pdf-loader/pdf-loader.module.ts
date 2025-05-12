import { Module } from '@nestjs/common';
import { PdfLoaderService } from './pdf-loader.service';

@Module({
  providers: [PdfLoaderService],
  exports: [PdfLoaderService],
})
export class PdfLoaderModule {}
