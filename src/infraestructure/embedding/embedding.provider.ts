import { Injectable } from '@nestjs/common';
import * as cp from 'child_process';

@Injectable()
export class EmbeddingProvider {
  async embed(texto: string): Promise<number[]> {
    return new Promise((resolve, reject) => {
      const prompt = `Genera un embedding numérico para este texto:\n${texto}`;
      const process = cp.spawn('ollama', ['run', 'qwen:0.5b'], {
        stdio: ['pipe', 'pipe', 'inherit'],
      });

      let output = '';
      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.on('close', () => {
        try {
          // Suponiendo que el modelo devuelve un array de números
          const embedding = JSON.parse(output.trim());
          resolve(embedding);
        } catch (error) {
          reject(`Error parseando embedding: ${error}`);
        }
      });

      process.stdin.write(prompt);
      process.stdin.end();
    });
  }
}
