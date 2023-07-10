import { Injectable } from '@nestjs/common';
import {
  UpsertInvoiceDTO,
} from './dtos/invoice.in.dto';
import { InvoiceOutDTO } from './dtos/invoice.out.dto';
import { InvoiceProvider } from './invoice.provider';

@Injectable()
export class InvoiceService {
  constructor(private invoiceProvider: InvoiceProvider) { }

  async listProjectInvoices(projectId: number): Promise<InvoiceOutDTO[]> {
    const invoices = await this.invoiceProvider.listProjectInvoices(projectId);
    return invoices.map((invoice) => new InvoiceOutDTO(invoice));
  }

  async getInvoice(id: number): Promise<InvoiceOutDTO> {
    return new InvoiceOutDTO(await this.invoiceProvider.getInvoice(id));
  }

  async upsertInvoice(data: UpsertInvoiceDTO) {
    return new InvoiceOutDTO(await this.invoiceProvider.upsertInvoice(data));
  }

  async deleteInvoice(id: number) {
    return new InvoiceOutDTO(await this.invoiceProvider.deleteInvoice(id));
  }
}
