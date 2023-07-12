import { Injectable, StreamableFile } from '@nestjs/common';
import {
  UpsertContractDTO,
} from './dtos/contract.in.dto';
import { ContractOutDTO } from './dtos/contract.out.dto';
import { ContractProvider } from './contract.provider';
import { TemplateService } from '@common/template/template.service';
import { Response } from 'express';
import fs from "fs";
import path from "path";
import dayjs from 'dayjs';

@Injectable()
export class ContractService {
  constructor(
    private contractProvider: ContractProvider,
    private templateService: TemplateService,
  ) { }

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

  async viewContract(res: Response, id: number) {
    const contract = await this.getContract(id);

    const buffer = fs.readFileSync(
      path.resolve(__dirname, "../../../../assets/contract.docx"),
      "binary"
    );

    const object = {
      contract_number: contract.number,
      contract_date: dayjs(contract.start).format('DD/MM/YYYY'),
      client_name: contract.client.name,
      client_address: contract.client.address,
      client_phone_number: contract.client.phoneNumber,
      client_rc: contract.client.rc,
      client_cif: contract.client.cif,
      client_iban: contract.client.bankIban,
      client_bank_name: contract.client.bankName,
      contract_representative: contract.representative,
    };

    const doc = await this.templateService.render(buffer, object);

    res.set({
      // 'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      // 'Content-Disposition': `filename=contract-${contract.number}.docx`,
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment;filename=contract-${contract.number}.docx`,
    });

    return new StreamableFile(doc);
  }
}
