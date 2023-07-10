import { Injectable } from '@nestjs/common';
import {
  UpsertReceiptDTO,
} from './dtos/receipt.in.dto';
import { ReceiptOutDTO } from './dtos/receipt.out.dto';
import { ReceiptProvider } from './receipt.provider';

@Injectable()
export class ReceiptService {
  constructor(private receiptProvider: ReceiptProvider) { }

  async listProjectReceipts(projectId: number): Promise<ReceiptOutDTO[]> {
    const receipts = await this.receiptProvider.listProjectReceipts(projectId);
    return receipts.map((receipt) => new ReceiptOutDTO(receipt));
  }

  async getReceipt(id: number): Promise<ReceiptOutDTO> {
    return new ReceiptOutDTO(await this.receiptProvider.getReceipt(id));
  }

  async upsertReceipt(data: UpsertReceiptDTO) {
    return new ReceiptOutDTO(await this.receiptProvider.upsertReceipt(data));
  }

  async deleteReceipt(id: number) {
    return new ReceiptOutDTO(await this.receiptProvider.deleteReceipt(id));
  }
}
