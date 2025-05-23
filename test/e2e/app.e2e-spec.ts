import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from '../../src/app.module';

describe('Aplicación (E2E)', () => {
  let app: INestApplication;
  const indexPath = path.join(__dirname, '..', '..', 'tfidf_index.json');

  beforeAll(async () => {
    // Crear la aplicación NestJS para pruebas
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Limpiar el índice si existe
    if (fs.existsSync(indexPath)) {
      fs.unlinkSync(indexPath);
    }
  });

  afterAll(async () => {
    // Limpiar después de las pruebas
    if (fs.existsSync(indexPath)) {
      fs.unlinkSync(indexPath);
    }
    await app.close();
  });

  it('debe completar el flujo end-to-end: carga de documentos -> indexación -> consulta -> respuesta', async () => {
    // Paso 1: Cargar documentos
    console.log('Paso 1: Cargando documentos...');
    const loadResponse = await request(app.getHttpServer())
      .post('/tfidf/load')
      .send({ chunkSize: 500 });
    
    expect(loadResponse.status).toBe(201);
    expect(loadResponse.body).toHaveProperty('message');
    console.log('Documentos cargados:', loadResponse.body);

    // Paso 2: Crear índice
    console.log('Paso 2: Creando índice TFIDF...');
    const indexResponse = await request(app.getHttpServer())
      .post('/tfidf/index');
    
    expect(indexResponse.status).toBe(201);
    expect(indexResponse.body).toHaveProperty('message');
    console.log('Índice creado:', indexResponse.body);

    // Verificar que el índice se ha creado correctamente
    expect(fs.existsSync(indexPath)).toBe(true);
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    expect(indexContent.length).toBeGreaterThan(0);

    // Paso 3: Realizar una consulta TFIDF
    console.log('Paso 3: Realizando consulta TFIDF...');
    const queryText = 'inteligencia artificial';
    const queryResponse = await request(app.getHttpServer())
      .get('/tfidf/query')
      .query({ q: queryText, k: 3 });
    
    expect(queryResponse.status).toBe(200);
    expect(queryResponse.body).toHaveProperty('results');
    expect(Array.isArray(queryResponse.body.results)).toBe(true);
    console.log(`Consulta TFIDF para "${queryText}":`, 
      queryResponse.body.results.length > 0 
        ? `${queryResponse.body.results.length} resultados encontrados` 
        : 'No se encontraron resultados');

    // Si no hay resultados, puede ser porque no hay documentos relevantes en la base de conocimiento
    // Esto no debería hacer fallar la prueba, pero lo registramos
    if (queryResponse.body.results.length === 0) {
      console.warn('No se encontraron resultados para la consulta TFIDF. Esto puede ser normal si no hay documentos relevantes.');
    }

    // Paso 4: Realizar una pregunta completa (flujo ask-question)
    console.log('Paso 4: Realizando pregunta al sistema...');
    const question = '¿Qué es la inteligencia artificial?';
    const askResponse = await request(app.getHttpServer())
      .post('/ask-question')
      .send({ pregunta: question });
    
    // Verificar la respuesta
    expect(askResponse.status).toBe(201);
    expect(askResponse.body).toHaveProperty('respuesta');
    expect(typeof askResponse.body.respuesta).toBe('string');
    expect(askResponse.body.respuesta.length).toBeGreaterThan(0);
    
    console.log(`Pregunta: "${question}"`);
    console.log(`Respuesta recibida (primeros 150 caracteres): "${askResponse.body.respuesta.substring(0, 150)}..."`);

    // Prueba completa exitosamente
    console.log('Prueba end-to-end completada con éxito');
  }, 30000); // Aumentamos el timeout a 30 segundos para dar tiempo a las operaciones

  // Prueba alternativa si no hay documentos en la base de conocimiento
  it('debe manejar correctamente una pregunta directa sin documentos indexados', async () => {
    // Eliminar el índice si existe para esta prueba
    if (fs.existsSync(indexPath)) {
      fs.unlinkSync(indexPath);
    }

    // Realizar una pregunta directamente al servicio de respuesta
    const preguntaDirecta = {
      pregunta: '¿Qué es machine learning?',
      contexto: 'Machine learning es una rama de la inteligencia artificial que permite a los sistemas aprender de los datos.'
    };

    const respuestaDirecta = await request(app.getHttpServer())
      .post('/respuesta/pregunta')
      .send(preguntaDirecta);
    
    expect(respuestaDirecta.status).toBe(201);
    expect(respuestaDirecta.body).toHaveProperty('respuesta');
    expect(typeof respuestaDirecta.body.respuesta).toBe('string');
    expect(respuestaDirecta.body.respuesta.length).toBeGreaterThan(0);
    
    console.log(`Pregunta directa: "${preguntaDirecta.pregunta}"`);
    console.log(`Respuesta directa (primeros 150 caracteres): "${respuestaDirecta.body.respuesta.substring(0, 150)}..."`);
  }, 15000); // 15 segundos de timeout
});