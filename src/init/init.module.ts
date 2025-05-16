import { Module } from '@nestjs/common';
import { InitService } from './init.service';
import { TfidfRetrieverModule } from '../TFIDF/tfidf.module';

@Module({
  imports: [
    TfidfRetrieverModule
  ],
  providers: [
    InitService
  ],
  exports: [
    InitService
  ]
})
export class InitModule {};