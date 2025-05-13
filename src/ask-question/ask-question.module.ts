import { Module } from '@nestjs/common';
import { AskQuestionService } from './ask-question.service';

@Module({
  providers: [AskQuestionService],
  exports: [AskQuestionService],
})
export class AskQuestionModule {}