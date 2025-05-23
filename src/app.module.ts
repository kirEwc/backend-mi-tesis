import { Module } from '@nestjs/common';
// import { RespuestaController } from './respuesta/respuesta.controller';
import { RespuestaModule } from './respuesta/respuesta.module';
// import { RespuestaService } from './respuesta/respuesta.service';
import { TfidfRetrieverModule } from './TFIDF/tfidf.module';
import { InitModule } from './init/init.module';
import { AskQuestionModule } from './usecases/ask-question/ask-question.module';
import { dataSource } from './database/datasource';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    TypeOrmModule.forRoot(dataSource.options),
    RespuestaModule,
    TfidfRetrieverModule,
    AskQuestionModule,
    InitModule,
    
  ],

})
export class AppModule {}
