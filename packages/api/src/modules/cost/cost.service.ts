import { Injectable } from '@nestjs/common';
import {
  UpsertCostDTO,
} from './dtos/cost.in.dto';
import { CostOutDTO } from './dtos/cost.out.dto';
import { CostProvider } from './cost.provider';

@Injectable()
export class CostService {
  constructor(private costProvider: CostProvider) { }

  async listProjectActivityCosts(activityId: number): Promise<CostOutDTO[]> {
    const costs = await this.costProvider.listProjectActivityCosts(activityId);
    return costs.map((cost) => new CostOutDTO(cost));
  }

  async getCost(id: number): Promise<CostOutDTO> {
    return new CostOutDTO(await this.costProvider.getCost(id));
  }

  async upsertCost(data: UpsertCostDTO) {
    return new CostOutDTO(await this.costProvider.upsertCost(data));
  }

  async deleteCost(id: number) {
    return new CostOutDTO(await this.costProvider.deleteCost(id));
  }
}
