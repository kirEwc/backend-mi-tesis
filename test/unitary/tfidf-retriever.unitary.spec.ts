import { TfidfRetrieverService } from '../../src/TFIDF/tfidf.service';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';

// ✅ Mock de pdf-parse
jest.mock('pdf-parse', () => {
  return jest.fn(() => Promise.resolve({ text: 'a'.repeat(1200) }));
});

describe('TfidfRetrieverService', () => {
  let service: TfidfRetrieverService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TfidfRetrieverService('mockKnowledgebase', 'mockIndex.json');
  });

  describe('loadAndSplit', () => {
    it('debe cargar y fragmentar PDFs con diferentes tamaños de chunk', async () => {
      const mockFiles = ['doc1.pdf', 'doc2.pdf'];

      jest.spyOn(fs, 'readdirSync').mockReturnValue(mockFiles as any);
      jest.spyOn(fs, 'readFileSync').mockReturnValue(Buffer.from('mockBuffer'));
      // No es necesario mockear pdfParse aquí ya que está mockeado a nivel de módulo

      await service.loadAndSplit(500);

      expect(service['texts'].length).toBeGreaterThan(0);
      expect(service['texts'][0].length).toBeLessThanOrEqual(500);
    });
  });

  describe('index', () => {
    it('debe generar correctamente la matriz TF-IDF', () => {
      service['texts'] = ['texto uno', 'texto dos'];
      service['tfidfVectorizer'].addDocument('texto uno');
      service['tfidfVectorizer'].addDocument('texto dos');

      const writeSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

      service.index();

      expect(service['documentVectors'].length).toBe(2);
      expect(writeSpy).toHaveBeenCalledWith('mockIndex.json', expect.any(String));
    });
  });

  describe('cosineSimilarity', () => {
    it('debe calcular correctamente la similitud coseno', () => {
      const vecA = [1, 2, 3];
      const vecB = [1, 2, 3];
      const vecC = [0, 0, 0];
      // @ts-ignore
      expect(service['cosineSimilarity'](vecA, vecB)).toBeCloseTo(1);
      // @ts-ignore
      expect(service['cosineSimilarity'](vecA, vecC)).toBe(0);
    });
  });

  describe('query', () => {
    it('debe devolver los k documentos más similares para diferentes consultas', () => {
      service['texts'] = ['hola mundo', 'adiós mundo', 'buenos días'];
      service['tfidfVectorizer'].addDocument('hola mundo');
      service['tfidfVectorizer'].addDocument('adiós mundo');
      service['tfidfVectorizer'].addDocument('buenos días');
      service['documentVectors'] = [
        [0.5, 0.5, 0],
        [0, 0.7, 0.3],
        [0.2, 0, 0.8]
      ];
      const result = service.query('hola', 2);
      expect(result.length).toBe(2);
      expect(result[0]).toHaveProperty('text');
      expect(result[0]).toHaveProperty('similarity');
    });
  });
});
