// tfidf-retriever.module.ts
import { Module } from '@nestjs/common';
import { TfidfRetrieverController } from './tfidf.controller';
import { TfidfRetrieverService } from './tfidf.service';

@Module({
  controllers: [TfidfRetrieverController],
  providers: [
    {
      provide: TfidfRetrieverService,
      useFactory: () => {
        return new TfidfRetrieverService('knowledgebase', 'tfidf_index.json');
      },
    },
  ],
  exports: [TfidfRetrieverService],
})
export class TfidfRetrieverModule {}