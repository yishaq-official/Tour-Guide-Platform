import { Heritage } from "../../models/Heritage.js";
import { Culture } from "../../models/Culture.js";

export class CatalogRepository {
  // Heritage Data Access
  async getAllHeritages() {
    return await Heritage.find();
  }

  async getHeritageById(id: string) {
    return await Heritage.findById(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createHeritage(data: any) {
    const heritage = new Heritage(data);
    return await heritage.save();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateHeritage(id: string, data: any) {
    return await Heritage.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteHeritage(id: string) {
    return await Heritage.findByIdAndDelete(id);
  }

  // Culture Data Access
  async getAllCultures() {
    return await Culture.find({});
  }

  async getCultureById(id: string) {
    return await Culture.findById(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createCulture(data: any) {
    const culture = new Culture(data);
    return await culture.save();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateCulture(id: string, data: any) {
    return await Culture.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteCulture(id: string) {
    return await Culture.findByIdAndDelete(id);
  }
}

export const catalogRepository = new CatalogRepository();
