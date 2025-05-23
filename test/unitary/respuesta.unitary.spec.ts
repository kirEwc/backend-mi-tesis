import { Test, TestingModule } from '@nestjs/testing';
// import { HttpException, HttpStatus } from '@nestjs/common';
import { RespuestaService } from '../../src/respuesta/respuesta.service';

// Mock the global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('RespuestaService', () => {
  let service: RespuestaService;

  // Sample test data
  const mockQuestion = '¿Qué es la inteligencia artificial?';
  const mockContext = 'La inteligencia artificial es un campo de la informática...';
  const mockApiResponse = {
    choices: [
      {
        message: {
          content: 'La inteligencia artificial es una rama de la informática...'
        }
      }
    ]
  };

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Create a testing module with the service
    const module: TestingModule = await Test.createTestingModule({
      providers: [RespuestaService],
    }).compile();

    service = module.get<RespuestaService>(RespuestaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Input Validation', () => {
    it('should throw an error when question is missing', async () => {
      await expect(service.obtenerRespuesta('', mockContext))
        .rejects
        .toThrow('La pregunta y el contexto son requeridos');
    });

    it('should throw an error when context is missing', async () => {
      await expect(service.obtenerRespuesta(mockQuestion, ''))
        .rejects
        .toThrow('La pregunta y el contexto son requeridos');
    });

    it('should throw an error when both question and context are missing', async () => {
      await expect(service.obtenerRespuesta('', ''))
        .rejects
        .toThrow('La pregunta y el contexto son requeridos');
    });
  });

  describe('API Integration', () => {
    beforeEach(() => {
      // Mock a successful API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockApiResponse,
      });
    });

    it('should call the OpenRouter API with correct parameters', async () => {
      await service.obtenerRespuesta(mockQuestion, mockContext);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://openrouter.ai/api/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': expect.any(String),
            'Content-Type': 'application/json'
          }),
          body: expect.any(String)
        })
      );

      // Verify the request body
      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(requestBody.model).toBe('mistralai/mistral-small-3.1-24b-instruct:free');
      expect(requestBody.messages[0].role).toBe('user');
      expect(requestBody.messages[0].content).toContain(mockQuestion);
      expect(requestBody.messages[0].content).toContain(mockContext);
    });

    it('should return the response from the API', async () => {
      const result = await service.obtenerRespuesta(mockQuestion, mockContext);
      expect(result).toBe(mockApiResponse.choices[0].message.content);
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors', async () => {
      // Mock a failed API response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: async () => ({
          error: {
            message: 'Rate limit exceeded'
          }
        })
      });

      await expect(service.obtenerRespuesta(mockQuestion, mockContext))
        .rejects
        .toThrow('Error en la API: 429 Too Many Requests');
    });

    it('should handle invalid API response format', async () => {
      // Mock an invalid API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({
          // Missing required fields
          invalid: 'response'
        })
      });

      await expect(service.obtenerRespuesta(mockQuestion, mockContext))
        .rejects
        .toThrow('Respuesta no válida del modelo de IA');
    });

    it('should handle network errors', async () => {
      // Mock a network error
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(service.obtenerRespuesta(mockQuestion, mockContext))
        .rejects
        .toThrow('Error al comunicarse con el modelo de IA: Network error');
    });
  });
});