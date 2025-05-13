import { Module } from '@nestjs/common';
import { RespuestaController } from './respuesta/respuesta.controller';
import { RespuestaModule } from './respuesta/respuesta.module';
import { RespuestaService } from './respuesta/respuesta.service';

@Module({
  imports: [
    RespuestaModule
  ],
  
  controllers: [
    RespuestaController
  ],
  providers: [ 
    RespuestaService
   ],
})
export class AppModule {}
