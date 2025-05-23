import { Test } from '@nestjs/testing';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

const logger = new Logger('IntegrationTest');

describe('AskQuestion Integration Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    try {
      // logger.log('Starting test setup...');
      const module = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = module.createNestApplication();
      
      // Enable CORS for testing
      app.enableCors({
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
      });
      
      // Enable validation pipe for DTOs
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          transform: true,
          forbidNonWhitelisted: true,
          transformOptions: {
            enableImplicitConversion: true,
          },
        }),
      );
      
      // logger.log('Initializing application...');
      await app.init();
      // logger.log('Application initialized');
    } catch (error) {
      logger.error('Error during test setup', error);
      throw error;
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /ask-question', () => {
    it('should return 200 and a response for a valid question', async () => {
      // Aumentar el timeout para dar tiempo a la respuesta del servicio de IA
      jest.setTimeout(10000); // 10 segundos
      // Skip this test if the application failed to initialize
      if (!app) {
        throw new Error('Application failed to initialize');
      }
      const testQuestion = '¿Qué es la inteligencia artificial?';
      const server = app.getHttpServer();
      
      // logger.log(`Sending request to /ask-question with question: ${testQuestion}`);
      
      try {
        const response = await request(server)
          .post('/ask-question')
          .set('Accept', 'application/json')
          .send({ pregunta: testQuestion });
        
        // logger.log('Response received', {
        //   status: response.status,
        //   body: response.body,
        //   headers: response.headers
        // });
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('respuesta');
        expect(typeof response.body.respuesta).toBe('string');
      } catch (error) {
        const errorMessage = error.response?.body?.message || error.message;
        const errorStatus = error.status || error.response?.status;
        
        logger.error('Test failed with error', {
          message: errorMessage,
          status: errorStatus,
          response: error.response?.body,
          stack: error.stack
        });
        
        // Log more details if available
        if (error.response) {
          logger.error('Error response details:', {
            status: error.response.status,
            statusText: error.response.statusText,
            headers: error.response.headers,
            body: error.response.body,
            text: error.response.text
          });
        }
        
        throw new Error(`Test failed: ${errorMessage}`);
      }
    });
  });
});
