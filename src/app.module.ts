import { Module } from '@nestjs/common';
import { RespuestaController } from './respuesta/respuesta.controller';
import { RespuestaModule } from './respuesta/respuesta.module';
import { RespuestaService } from './respuesta/respuesta.service';
import { TfidfRetrieverModule } from './TFIDF/tfidf.module';
import { InitModule } from './init/init.module';

@Module({
  imports: [
    RespuestaModule,
    TfidfRetrieverModule,
    InitModule
  ],
  
  controllers: [
    RespuestaController
  ],
  providers: [ 
    RespuestaService
   ],
})
export class AppModule {}
