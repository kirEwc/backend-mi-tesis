import { Module } from '@nestjs/common';
// import { RespuestaController } from './respuesta/respuesta.controller';
import { RespuestaModule } from './respuesta/respuesta.module';
// import { RespuestaService } from './respuesta/respuesta.service';
import { TfidfRetrieverModule } from './TFIDF/tfidf.module';
import { InitModule } from './init/init.module';
import { AskQuestionModule } from './usecases/ask-question/ask-question.module';
import { dataSource } from './database/datasource';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat/chat.service';
import { UserService } from './user/user.service';
import { ChatController } from './chat/chat.controller';
import { UserController } from './user/user.controller';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(dataSource.options),
    RespuestaModule,
    TfidfRetrieverModule,
    AskQuestionModule,
    InitModule,
    ChatModule,
    UserModule  // Añadir esta línea
  ],
  controllers: [
    // Eliminar UserController de aquí
  ],
  providers: [
    // Eliminar UserService de aquí
  ]
})
export class AppModule {}
