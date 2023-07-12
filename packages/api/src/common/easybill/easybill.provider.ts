import { ConfigService } from "@common/config/config.service";
import { HttpException, Injectable } from "@nestjs/common";
import { EasyBillClientOutDTO, EasyBillCreateInvoiceOutDTO, EasyBillProductOutDTO, EasyBillSessionOutDTO } from "./types";
import fetch from "node-fetch";
import { URLSearchParams } from 'url';
import { isEmpty } from "class-validator";
import dayjs from "dayjs";

@Injectable()
export class EasyBillProvider {
  constructor(
    private config: ConfigService,
  ) { }

  async login(): Promise<EasyBillSessionOutDTO> {
    try {
      const params = new URLSearchParams();
      params.set('mode', 'api');
      params.set('sec', 'authenticateUser_fct');
      params.set('Username', this.config.get('EASYBILL_USERNAME'));
      params.set('Password', this.config.get('EASYBILL_PASSWORD'));

      const res = await fetch(`${this.config.get('EASYBILL_ENDPOINT')}&${params.toString()}`);

      const json = await res.json() as EasyBillSessionOutDTO;

      return json;
    }
    catch (e) {
      throw new HttpException({ message: 'Could not login to EasyBill!' }, 500, {});
    }
  }

  async logout(session: EasyBillSessionOutDTO): Promise<EasyBillSessionOutDTO> {
    try {
      const params = new URLSearchParams();
      params.set('mode', 'api');
      params.set('sec', 'logoutUser_fct');
      params.set('AppUnique', session.AppUnique);
      params.set('UserId', session.UserId);
      params.set('SessionId', session.SessionId);

      const res = await fetch(`${this.config.get('EASYBILL_ENDPOINT')}&${params.toString()}`);
      const json = await res.json() as EasyBillSessionOutDTO;

      return json;
    }
    catch (e) {
      // throw new HttpException({ message: 'Could not logout to EasyBill!' }, 500, {});
    }
  }

  async searchClient(session: EasyBillSessionOutDTO, query: string): Promise<EasyBillClientOutDTO[]> {
    try {
      const params = new URLSearchParams();
      params.set('mode', 'api');
      params.set('sec', 'searchClient_fct');
      params.set('AppUnique', session.AppUnique);
      params.set('UserId', session.UserId);
      params.set('SessionId', session.SessionId);
      params.set('query', query);

      const res = await fetch(`${this.config.get('EASYBILL_ENDPOINT')}&${params.toString()}`);
      const json = await res.json() as EasyBillClientOutDTO[];

      return json;
    }
    catch (e) { }
  }

  async createInvoice(
    session: EasyBillSessionOutDTO,
    client: Partial<EasyBillClientOutDTO>,
    representativeName: string,
    products: Partial<EasyBillProductOutDTO>[],
    date: Date,
  ) {
    try {
      const params = new URLSearchParams();
      params.set('mode', 'api');
      params.set('sec', 'createInvoice_fct');
      params.set('AppUnique', session.AppUnique);
      params.set('UserId', session.UserId);
      params.set('SessionId', session.SessionId);

      if (isEmpty(client.clientId)) {
        const clientSearch = await this.searchClient(session, client.clientCIF);

        // if (!isEmpty(clientSearch.at(0))) {
        //   params.set('clientId', clientSearch.at(0).clientId);
        // } else {
        params.set('clientName', client.clientName);
        params.set('clientCIF', client.clientCIF);
        params.set('clientNrRegCom', client.clientNrRegCom);
        params.set('clientAddressLine', client.clientAddressLine);
        params.set('clientBank', client.clientBank);
        params.set('clientBankAccount', client.clientBankAccount);
        params.set('clientEmail', client.clientEmail);
        params.set('invoiceStatus', '1');
        params.set('invoiceDate', dayjs(date).format('YYYY-MM-DD'));
        params.set('representativeName', representativeName);
        params.set('json', '1');
        params.set('invoiceNoProducts', `${products.length}`);
        // }

        products.forEach((product, index) => {
          params.set(`productName${index + 1}`, product.productName);
          params.set(`productQuantity${index + 1}`, product.productQuantity);
          params.set(`productPrice${index + 1}`, product.productPrice);
          params.set(`productVAT${index + 1}`, product.productVAT);
          params.set(`productCurrency${index + 1}`, product.productCurrency);
        });
      }

      const res = await fetch(`${this.config.get('EASYBILL_ENDPOINT')}&${params.toString()}`);
      const json = await res.json() as EasyBillCreateInvoiceOutDTO;

      return json;
    }
    catch (e) {
      throw new HttpException('Could not create invoice!', 500, {});
    }
  }

  getInvoiceUrl(session: EasyBillSessionOutDTO, invoiceNumber: string) {
    const params = new URLSearchParams();
    params.set('mode', 'api');
    params.set('sec', 'downloadInvoice_fct');
    params.set('AppUnique', session.AppUnique);
    params.set('UserId', session.UserId);
    params.set('SessionId', session.SessionId);
    params.set('nh', '1');
    params.set('fact', invoiceNumber);
    params.set('dim', 'a4');

    return `${this.config.get('EASYBILL_ENDPOINT')}&${params.toString()}`;
  }
}
