import { Module } from '@nestjs/common';
import { InitService } from './init.service';
import { VectorizerModule } from '../vectorizer/vectorizer.module';

@Module({
  imports: [VectorizerModule],
  providers: [InitService],
  exports: [InitService]
})
export class InitModule {}