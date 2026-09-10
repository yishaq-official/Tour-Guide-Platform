import { catalogRepository, CatalogRepository } from "./catalog.repository.js";

export class CultureService {
  constructor(private repo: CatalogRepository = catalogRepository) {}

  async getAllCultures() {
    return await this.repo.getAllCultures();
  }

  async getCultureById(id: string) {
    return await this.repo.getCultureById(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createCulture(data: any) {
    return await this.repo.createCulture(data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateCulture(id: string, data: any) {
    return await this.repo.updateCulture(id, data);
  }

  async deleteCulture(id: string) {
    return await this.repo.deleteCulture(id);
  }
}

export const cultureService = new CultureService();
