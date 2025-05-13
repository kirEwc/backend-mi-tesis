import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common'; // <--- AÑADIR ESTA LÍNEA

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ // <--- AÑADIR ESTA LÍNEA
    whitelist: true, // Ignora propiedades no definidas en el DTO
    forbidNonWhitelisted: true, // Lanza error si hay propiedades no definidas
    transform: true, // Transforma el payload a una instancia del DTO
  }));

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Chatbot SIGIES')
    .setDescription('API para chatbot de conversación')
    .setVersion('0.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Cambiado de 'docs' a 'api' como en tu main.ts original
  
  // Configuración de CORS
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
