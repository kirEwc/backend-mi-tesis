import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RespuestaController } from './respuesta.controller';
import { RespuestaService } from './respuesta.service';

@Module({
  imports: [HttpModule],
  controllers: [RespuestaController],
  providers: [RespuestaService],
  exports: [RespuestaService],
})
export class RespuestaModule {}