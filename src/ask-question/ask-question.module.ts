import { Module } from '@nestjs/common';
import { AskQuestionService } from './ask-question.service';
import { AskQuestionController } from './ask-question.controller';
import { EmbeddingModule } from '../embedding/embedding.module';
import { VectorizerModule } from '../vectorizer/vectorizer.module';

@Module({
  imports: [
    EmbeddingModule,
    VectorizerModule,
  ],
  controllers: [AskQuestionController],
  providers: [AskQuestionService],
  exports: [AskQuestionService],
})
export class AskQuestionModule {}