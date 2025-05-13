import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { AskQuestionModule } from '../ask-question/ask-question.module';
import { VectorizerModule } from '../vectorizer/vectorizer.module';

@Module({
  imports: [AskQuestionModule, VectorizerModule],
  controllers: [ChatController],
})
export class ChatModule {}