import { Module } from '@nestjs/common';
import { AskQuestionController } from './ask-question.controller';
import { AskQuestionService } from './ask-question.service';
import { TfidfRetrieverModule } from '../../TFIDF/tfidf.module';
import { RespuestaModule } from '../../respuesta/respuesta.module';

@Module({
  imports: [
    TfidfRetrieverModule,
    RespuestaModule,
  ],
  
  controllers: [
    AskQuestionController,
  ],
  providers: [ 
    AskQuestionService,
   ],
})
export class AskQuestionModule {}
