import { catalogRepository, CatalogRepository } from "./catalog.repository.js";

export class HeritageService {
  constructor(private repo: CatalogRepository = catalogRepository) {}

  async getAllHeritages() {
    return await this.repo.getAllHeritages();
  }

  async getHeritageById(id: string) {
    return await this.repo.getHeritageById(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createHeritage(data: any) {
    return await this.repo.createHeritage(data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateHeritage(id: string, data: any) {
    return await this.repo.updateHeritage(id, data);
  }

  async deleteHeritage(id: string) {
    return await this.repo.deleteHeritage(id);
  }
}

export const heritageService = new HeritageService();
