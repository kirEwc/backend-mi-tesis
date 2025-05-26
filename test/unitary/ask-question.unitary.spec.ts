import { Test, TestingModule } from '@nestjs/testing';
import { AskQuestionService } from '../../src/usecases/ask-question/ask-question.service';
import { TfidfRetrieverService } from '../../src/TFIDF/tfidf.service';
import { RespuestaService } from '../../src/respuesta/respuesta.service';
import { AskQuestionDto } from '../../src/usecases/ask-question/dto/ask-question.dto';
import { validate } from 'class-validator';

describe('AskQuestionService', () => {
  let service: AskQuestionService;
  let mockTfidfService: jest.Mocked<TfidfRetrieverService>;
  let mockRespuestaService: jest.Mocked<RespuestaService>;

  beforeEach(async () => {
    // Crear mocks para las dependencias
    mockTfidfService = {
      query: jest.fn(),
    } as any;

    mockRespuestaService = {
      obtenerRespuesta: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AskQuestionService,
        { provide: TfidfRetrieverService, useValue: mockTfidfService },
        { provide: RespuestaService, useValue: mockRespuestaService },
      ],
    }).compile();

    service = module.get<AskQuestionService>(AskQuestionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('procesarPregunta', () => {
    it('debe procesar correctamente una pregunta y devolver una respuesta', async () => {
      // Configurar los mocks
      const mockResultados = [
        { text: 'Texto de ejemplo 1', similarity: 0.9 },
        { text: 'Texto de ejemplo 2', similarity: 0.8 },
      ];
      
      const mockRespuesta = 'Esta es una respuesta generada';
      
      mockTfidfService.query.mockReturnValue(mockResultados);
      mockRespuestaService.obtenerRespuesta.mockResolvedValue(mockRespuesta);

      // Ejecutar el método a probar
      const pregunta = '¿Qué es el aprendizaje automático?';
      const resultado = await service.procesarPregunta(pregunta);

      // Verificar las llamadas a los mocks
      expect(mockTfidfService.query).toHaveBeenCalledWith(pregunta, 5);
      expect(mockRespuestaService.obtenerRespuesta).toHaveBeenCalledWith(
        pregunta,
        'Texto de ejemplo 1\nTexto de ejemplo 2'
      );
      
      // Verificar el resultado
      expect(resultado).toBe(mockRespuesta);
    });

    it('debe manejar correctamente cuando no hay resultados de búsqueda', async () => {
      // Configurar el mock para devolver un array vacío
      mockTfidfService.query.mockReturnValue([]);
      const mockRespuesta = 'No se encontró información relevante';
      mockRespuestaService.obtenerRespuesta.mockResolvedValue(mockRespuesta);

      // Ejecutar el método a probar
      const pregunta = 'Pregunta sin resultados';
      const resultado = await service.procesarPregunta(pregunta);

      // Verificar las llamadas
      expect(mockTfidfService.query).toHaveBeenCalledWith(pregunta, 5);
      expect(mockRespuestaService.obtenerRespuesta).toHaveBeenCalledWith(pregunta, '');
      expect(resultado).toBe(mockRespuesta);
    });
  });
});

describe('AskQuestionDto', () => {
  it('debe validar correctamente un DTO válido', async () => {
    const dto = new AskQuestionDto();
    dto.pregunta = '¿Qué es la inteligencia artificial?';
    
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('debe fallar cuando la pregunta está vacía', async () => {
    const dto = new AskQuestionDto();
    dto.pregunta = '';
    
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints.isNotEmpty).toBeDefined();
  });

  it('debe fallar cuando la pregunta no es un string', async () => {
    const dto = new AskQuestionDto();
    // @ts-ignore - Probando validación con tipo incorrecto
    dto.pregunta = 12345;
    
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints.isString).toBeDefined();
  });
});
