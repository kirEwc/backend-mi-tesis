import { Module } from '@nestjs/common';
import { PdfLoaderModule } from './pdf-loader/pdf-loader.module';
import { PdfLoaderService } from './pdf-loader/pdf-loader.service';
import { PdfLoaderController } from './pdf-loader/pdf-loader.controller';

@Module({
  imports: [ PdfLoaderModule ],
  controllers: [PdfLoaderController],
  providers: [ PdfLoaderService ],
})
export class AppModule {}
