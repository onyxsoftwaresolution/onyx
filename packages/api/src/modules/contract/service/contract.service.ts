import { Injectable } from '@nestjs/common';
import {
  UpsertContractDTO,
} from '../dtos/contract.in.dto';
import { ContractOutDTO } from '../dtos/contract.out.dto';
import { ContractProvider } from '../provider/contract.provider';

@Injectable()
export class ContractService {
  constructor(private contractProvider: ContractProvider) { }

  async listContracts() {
    const contracts = await this.contractProvider.listContracts();
    return contracts.map((e) => new ContractOutDTO(e));
  }

  async getContract(id: number): Promise<ContractOutDTO> {
    return new ContractOutDTO(await this.contractProvider.getContract(id));
  }

  async upsertContract(data: UpsertContractDTO) {
    return new ContractOutDTO(await this.contractProvider.upsertContract(data));
  }

  async deleteContract(id: number) {
    return new ContractOutDTO(await this.contractProvider.deleteContract(id));
  }
}
