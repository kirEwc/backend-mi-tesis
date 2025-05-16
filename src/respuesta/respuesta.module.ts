import { Module } from '@nestjs/common';
import { RespuestaController } from './respuesta.controller';
import { RespuestaService } from './respuesta.service';

@Module({
  controllers: [RespuestaController],
  providers: [RespuestaService],
  exports: [RespuestaService],

})
export class RespuestaModule {}