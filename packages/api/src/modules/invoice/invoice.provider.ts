import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable, NotImplementedException } from '@nestjs/common';
import {
  UpsertInvoiceDTO,
} from './dtos/invoice.in.dto';
import { InvoiceOutDTO } from './dtos/invoice.out.dto';

@Injectable()
export class InvoiceProvider {
  constructor(private prismaService: PrismaService) { }

  async listInvoices(): Promise<InvoiceOutDTO[]> {
    return ([
      { id: 1, number: 'HTC100' },
      { id: 2, number: 'HTC101' },
      { id: 3, number: 'HTC102' },
      { id: 4, number: 'HTC103' },
    ])
  }

  async getInvoice(id: number): Promise<InvoiceOutDTO> {
    throw new NotImplementedException();
  }

  async upsertInvoice({ id, ...data }: UpsertInvoiceDTO): Promise<InvoiceOutDTO> {
    throw new NotImplementedException();
  }

  async deleteInvoice(id: number): Promise<InvoiceOutDTO> {
    throw new NotImplementedException();
  }
}
