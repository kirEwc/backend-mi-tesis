import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RespuestaController } from './respuesta/respuesta.controller';
import { RespuestaModule } from './respuesta/respuesta.module';
import { RespuestaService } from './respuesta/respuesta.service';
import { TfidfRetrieverModule } from './TFIDF/tfidf.module';
import { InitModule } from './init/init.module';
import { AskQuestionModule } from './usecases/ask-question/ask-question.module';
import { AskQuestionController } from './usecases/ask-question/ask-question.controller';
import { AskQuestionService } from './usecases/ask-question/ask-question.service';

@Module({
  imports: [
    HttpModule,
    RespuestaModule,
    TfidfRetrieverModule,
    AskQuestionModule,
    InitModule
  ],
  
  controllers: [
    RespuestaController,
    AskQuestionController,
  ],
  providers: [ 
    AskQuestionService,
    RespuestaService
   ],
})
export class AppModule {}
