import { HttpException, Injectable } from '@nestjs/common';
import {
  UpsertInvoiceDTO,
} from './dtos/invoice.in.dto';
import { InvoiceDownloadUrl, InvoiceOutDTO } from './dtos/invoice.out.dto';
import { InvoiceProvider } from './invoice.provider';
import { QueryPaths } from '@common/QueryParams';
import { EasyBillService } from '@common/easybill/easybill.service';
import { isEmpty } from 'class-validator';
import { ProjectService } from '@modules/project/project.service';
import dayjs from 'dayjs';
import { randomUUID } from 'crypto';

@Injectable()
export class InvoiceService {
  constructor(
    private invoiceProvider: InvoiceProvider,
    private easyBillService: EasyBillService,
    private projectService: ProjectService,
  ) { }

  async listProjectInvoices(projectId: number): Promise<InvoiceOutDTO[]> {
    const invoices = await this.invoiceProvider.listProjectInvoices(projectId);
    return invoices.map((invoice) => new InvoiceOutDTO(invoice));
  }

  async getInvoice(id: number, paths: QueryPaths): Promise<InvoiceOutDTO> {
    return new InvoiceOutDTO(await this.invoiceProvider.getInvoice(id, paths));
  }

  async getInvoiceUrl(invoiceNumber: string) {
    const url = await this.easyBillService.getInvoiceUrl(invoiceNumber);
    return new InvoiceDownloadUrl(url);
  }

  async upsertInvoice(data: UpsertInvoiceDTO) {
    if (!isEmpty(data.id)) {
      throw new HttpException('Cannot edit invoice!', 500, {});
    }

    const project = await this.projectService.getProject(data.projectId);

    const easyBillInvoice = await this.easyBillService.createInvoice(
      {
        clientName: project.contract.client.name,
        clientAddressLine: project.contract.client.address,
        clientCIF: project.contract.client.cif,
        clientNrRegCom: project.contract.client.rc,
        clientBank: project.contract.client.bankName,
        clientBankAccount: project.contract.client.bankIban,
        clientEmail: project.contract.client.email,
      },
      project.contract.representative,
      project.projectActivities.map(pa => ({
        productCurrency: 'RON',
        productName: pa.activityTemplate.product?.name ?? pa.description,
        productQuantity: pa.quantity?.toString(),
        productPrice: pa.cost?.toString(),
        productVAT: '19',
      })),
      dayjs(data.issueDate).toDate(),
    );

    data.number = easyBillInvoice?.ebInvoiceNo ?? randomUUID();

    const localInvoice = new InvoiceOutDTO(await this.invoiceProvider.upsertInvoice(data));

    return localInvoice;
  }

  async deleteInvoice(id: number) {
    return new InvoiceOutDTO(await this.invoiceProvider.deleteInvoice(id));
  }
}
