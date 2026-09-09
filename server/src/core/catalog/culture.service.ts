import { Culture } from "../../models/Culture.js";

export class CultureService {
  async getAllCultures() {
    return await Culture.find({});
  }

  async getCultureById(id: string) {
    return await Culture.findById(id);
  }

  async createCulture(data: any) {
    const culture = new Culture(data);
    return await culture.save();
  }

  async updateCulture(id: string, data: any) {
    return await Culture.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteCulture(id: string) {
    return await Culture.findByIdAndDelete(id);
  }
}

export const cultureService = new CultureService();
