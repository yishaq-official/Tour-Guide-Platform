import type {
  IVectorStore,
  VectorRecord,
  VectorSearchResult,
} from "../interfaces/IVectorStore.js";

/**
 * In-memory reference implementation of IVectorStore.
 * Provides high-speed vector storage and cosine-similarity querying
 * without requiring external cloud databases (e.g., Pinecone, Qdrant).
 */
export class InMemoryVectorStore implements IVectorStore {
  private store: Map<string, VectorRecord> = new Map();

  async initialize(): Promise<void> {
    this.store.clear();
  }

  async upsert(records: VectorRecord[]): Promise<void> {
    for (const record of records) {
      this.store.set(record.id, record);
    }
  }

  async similaritySearch(
    queryVector: number[],
    topK: number = 5,
    filter?: Record<string, any>
  ): Promise<VectorSearchResult[]> {
    const results: VectorSearchResult[] = [];

    const queryNorm = Math.sqrt(
      queryVector.reduce((sum, val) => sum + val * val, 0)
    );
    if (queryNorm === 0) return [];

    for (const record of this.store.values()) {
      // Apply metadata filter if provided
      if (filter) {
        let matches = true;
        for (const [key, value] of Object.entries(filter)) {
          if (record.metadata?.[key] !== value) {
            matches = false;
            break;
          }
        }
        if (!matches) continue;
      }

      // Calculate Cosine Similarity
      const recordNorm = Math.sqrt(
        record.values.reduce((sum, val) => sum + val * val, 0)
      );
      if (recordNorm === 0) continue;

      let dotProduct = 0;
      const len = Math.min(queryVector.length, record.values.length);
      for (let i = 0; i < len; i++) {
        const qVal = queryVector[i];
        const rVal = record.values[i];
        if (qVal !== undefined && rVal !== undefined) {
          dotProduct += qVal * rVal;
        }
      }

      const score = dotProduct / (queryNorm * recordNorm);

      results.push({
        id: record.id,
        text: record.text,
        metadata: record.metadata,
        score,
      });
    }

    // Sort descending by similarity score
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, topK);
  }

  async delete(ids: string[]): Promise<void> {
    for (const id of ids) {
      this.store.delete(id);
    }
  }

  size(): number {
    return this.store.size;
  }
}

export const inMemoryVectorStore = new InMemoryVectorStore();
