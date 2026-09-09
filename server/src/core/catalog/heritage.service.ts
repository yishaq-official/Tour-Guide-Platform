import { Heritage } from "../../models/Heritage.js";

export class HeritageService {
  async getAllHeritages() {
    return await Heritage.find();
  }

  async getHeritageById(id: string) {
    return await Heritage.findById(id);
  }

  async createHeritage(data: any) {
    const heritage = new Heritage(data);
    return await heritage.save();
  }

  async updateHeritage(id: string, data: any) {
    return await Heritage.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteHeritage(id: string) {
    return await Heritage.findByIdAndDelete(id);
  }
}

export const heritageService = new HeritageService();
