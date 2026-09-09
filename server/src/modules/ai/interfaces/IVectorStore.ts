export interface VectorSearchResult {
  id: string;
  text: string;
  metadata: Record<string, any>;
  score: number;
}

export interface VectorRecord {
  id: string;
  values: number[];
  metadata: Record<string, any>;
  text: string;
}

export interface IVectorStore {
  initialize(): Promise<void>;
  upsert(records: VectorRecord[]): Promise<void>;
  similaritySearch(queryVector: number[], topK: number, filter?: Record<string, any>): Promise<VectorSearchResult[]>;
  delete(ids: string[]): Promise<void>;
}
