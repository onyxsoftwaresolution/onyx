export type EasyBillSessionOutDTO = {
  Alias: string;
  status: number,
  SessionId: string,
  AppUnique: string,
  UserId: string,
  StatusMessage: "Success"
}

export type EasyBillClientOutDTO = {
  clientCIF: string;
  clientCountryCode: string;
  clientPaymentTerms: string;
  clientName: string;
  clientContactPerson: string;
  clientAddressLine: string;
  clientNotificationsEmail: string;
  clientBankAccount: string;
  clientId: string;
  clientCity: string;
  clientCounty: string;
  clientEmail: string;
  clientCountyCode: string;
  clientNrRegCom: string;
  clientPhone: string;
  clientNotificationsSms: string;
  clientBank: string;
}

export type EasyBillCreateInvoiceOutDTO = {
  status: number;
  ebInvoiceNo: string;
}

export type EasyBillProductOutDTO = {
  productId: string;
  productName: string;
  productSerie: string;
  productWarranty: string;
  productUM: string;
  productQuantity: string;
  productPrice: string;
  productVAT: string;
  productCurrency: string;
}
