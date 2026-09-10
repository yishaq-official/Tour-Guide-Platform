import type { IEmbeddingService } from "../interfaces/IEmbeddingService.js";

/**
 * Local deterministic pseudo-embedding generator.
 * Produces fixed-dimension normalized vectors based on hashing text tokens,
 * allowing full vector pipeline testing without external API keys.
 */
export class LocalEmbeddingService implements IEmbeddingService {
  private dimensions: number;

  constructor(dimensions: number = 128) {
    this.dimensions = dimensions;
  }

  getDimensions(): number {
    return this.dimensions;
  }

  async embedText(text: string): Promise<number[]> {
    const vector = new Array(this.dimensions).fill(0);
    const tokens = text.toLowerCase().split(/\W+/).filter(Boolean);

    if (tokens.length === 0) {
      return vector;
    }

    for (const token of tokens) {
      // Simple hash distribution
      let hash = 0;
      for (let i = 0; i < token.length; i++) {
        hash = (hash << 5) - hash + token.charCodeAt(i);
        hash |= 0;
      }
      const index = Math.abs(hash) % this.dimensions;
      vector[index] += 1;
    }

    // Normalize vector to unit length
    const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
    if (norm > 0) {
      for (let i = 0; i < this.dimensions; i++) {
        vector[i] /= norm;
      }
    }

    return vector;
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((t) => this.embedText(t)));
  }
}

export const localEmbeddingService = new LocalEmbeddingService();
