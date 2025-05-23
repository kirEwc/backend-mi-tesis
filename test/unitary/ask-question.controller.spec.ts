import { Test, TestingModule } from '@nestjs/testing';
import { AskQuestionController } from '../../src/usecases/ask-question/ask-question.controller';
import { AskQuestionService } from '../../src/usecases/ask-question/ask-question.service';
import { AskQuestionDto } from '../../src/usecases/ask-question/dto/ask-question.dto';

describe('AskQuestionController', () => {
  let controller: AskQuestionController;
  let service: AskQuestionService;

  beforeEach(async () => {
    const mockAskQuestionService = {
      procesarPregunta: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AskQuestionController],
      providers: [{
          provide: AskQuestionService,
          useValue: mockAskQuestionService,
        },],}).compile();

    controller = module.get<AskQuestionController>(AskQuestionController);
    service = module.get<AskQuestionService>(AskQuestionService);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('hacerPregunta', () => {
    it('debe llamar al servicio y devolver la respuesta correctamente', async () => {
      const dto = new AskQuestionDto();
      dto.pregunta = '¿Qué es el SIGIES?';
      
      const respuestaEsperada = 'El sistema de gestion para el ingreso a la educacion superior...';
      jest.spyOn(service, 'procesarPregunta').mockResolvedValue(respuestaEsperada);

      const resultado = await controller.hacerPregunta(dto);

      expect(service.procesarPregunta).toHaveBeenCalledWith(dto.pregunta);
      expect(resultado).toEqual({ respuesta: respuestaEsperada });
    });
  });
});