import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import * as fs from 'fs';
import * as path from 'path';

describe('TfidfRetriever (Functional)', () => {
  let app: INestApplication;
  const indexPath = path.join(__dirname, '..', '..', 'tfidf_index.json');

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    // Limpiar el archivo de índice después de las pruebas
    if (fs.existsSync(indexPath)) {
      fs.unlinkSync(indexPath);
    }
  });

  it('debe completar el flujo load -> index -> query y persistir el índice', async () => {
    try {
      // Asegurarse de que el archivo de índice no exista antes de empezar
      if (fs.existsSync(indexPath)) {
        console.log('Eliminando archivo de índice existente...');
        fs.unlinkSync(indexPath);
      }

      console.log('Iniciando prueba de carga de documentos...');
      // 1. Llamar a /tfidf/load
      const loadResponse = await request(app.getHttpServer())
        .post('/tfidf/load')
        .send({ docsPath: './knowledgebase', chunkSize: 500 });
      
      console.log('Respuesta de carga:', loadResponse.status, loadResponse.body);
      expect(loadResponse.status).toBe(201);

      console.log('Iniciando indexación...');
      // 2. Llamar a /tfidf/index
      const indexResponse = await request(app.getHttpServer())
        .post('/tfidf/index');
      
      console.log('Respuesta de indexación:', indexResponse.status, indexResponse.body);
      expect(indexResponse.status).toBe(201);

      // Verificar que el archivo de índice se ha creado
      console.log('Verificando archivo de índice...');
      const indexExists = fs.existsSync(indexPath);
      console.log('¿Existe el archivo de índice?', indexExists);
      expect(indexExists).toBe(true);
      
      if (indexExists) {
        const indexContent = fs.readFileSync(indexPath, 'utf8');
        console.log('Tamaño del archivo de índice:', indexContent.length);
        expect(indexContent).toBeDefined();
        expect(indexContent.length).toBeGreaterThan(0);
      }

      console.log('Realizando consulta de prueba...');
      // 3. Llamar a /tfidf/query con parámetros de consulta GET
      const queryResult = await request(app.getHttpServer())
        .get('/tfidf/query')
        .query({ q: 'test query', k: 2 });
      
      console.log('Resultado de la consulta:', queryResult.status, queryResult.body);
      expect(queryResult.status).toBe(200);

      // Verificar la estructura y contenido del resultado de la consulta
      expect(queryResult.body).toHaveProperty('results');
      expect(Array.isArray(queryResult.body.results)).toBe(true);
      expect(queryResult.body.results.length).toBeLessThanOrEqual(2);
      
      if (queryResult.body.results.length > 0) {
        console.log('Primer resultado:', queryResult.body.results[0]);
        expect(queryResult.body.results[0]).toHaveProperty('text');
        expect(queryResult.body.results[0]).toHaveProperty('similarity');
        expect(typeof queryResult.body.results[0].text).toBe('string');
        expect(typeof queryResult.body.results[0].similarity).toBe('number');
      } else {
        console.warn('La consulta no devolvió resultados');
      }
    } catch (error) {
      console.error('Error durante la prueba:', error);
      throw error;
    }
  });

  it('debe cargar el índice existente si está presente', async () => {
    // Configurar un índice de prueba simple
    const mockIndexData = {
      terms: ['test', 'document'],
      documentVectors: [[0.5, 0.5]],
      texts: ['Este es un documento de prueba']
    };
    
    // Asegurarse de que el directorio existe
    const dir = path.dirname(indexPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Escribir el archivo de índice mock
    fs.writeFileSync(indexPath, JSON.stringify(mockIndexData));
    
    try {
      // Realizar una consulta simple
      const queryResult = await request(app.getHttpServer())
        .get('/tfidf/query')
        .query({ q: 'documento', k: 1 });
      
      // Verificar la respuesta
      expect(queryResult.status).toBe(200);
      expect(queryResult.body).toBeDefined();
      
      // Solo verificar la estructura básica de la respuesta
      if (queryResult.body.results && queryResult.body.results.length > 0) {
        const result = queryResult.body.results[0];
        expect(result).toHaveProperty('text');
        expect(result).toHaveProperty('similarity');
      } else {
        console.warn('La consulta no devolvió resultados');
      }
    } catch (error) {
      console.error('Error durante la prueba:', error);
      throw error;
    } finally {
      // Limpiar
      if (fs.existsSync(indexPath)) {
        fs.unlinkSync(indexPath);
      }
    }
  });
});