import { Injectable } from "@nestjs/common";
import { EasyBillClientOutDTO, EasyBillProductOutDTO, EasyBillSessionOutDTO } from "./types";
import { EasyBillProvider } from "./easybill.provider";

@Injectable()
export class EasyBillService {
  constructor(
    private easyBillProvider: EasyBillProvider,
  ) { }

  async createInvoice(
    client: Partial<EasyBillClientOutDTO>,
    representativeName: string,
    products: Partial<EasyBillProductOutDTO>[],
    date: Date,
  ) {
    const session = await this.easyBillProvider.login();
    const invoice = await this.easyBillProvider.createInvoice(
      session,
      client,
      representativeName,
      products,
      date,
    );
    await this.easyBillProvider.logout(session);

    return invoice;
  }

  async getInvoiceUrl(invoiceNumber: string) {
    const session = await this.easyBillProvider.login();
    const url = this.easyBillProvider.getInvoiceUrl(session, invoiceNumber);
    return ({ invoiceNumber, url });
  }
}
