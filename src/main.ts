import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Agente Conversacional de SIGIES')
    .setDescription('API para chatbot de conversación')
    .setVersion('0.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Cambiado de 'docs' a 'api' como en tu main.ts original
  
  // Configuración de CORS
  app.enableCors({
    // origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
