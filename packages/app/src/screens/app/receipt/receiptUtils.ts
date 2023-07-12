import { InvoiceOutDTO } from "@workspace/api/src/modules/invoice/dtos/invoice.out.dto";

export const getInvoiceReceiptSum = (invoice: InvoiceOutDTO) => invoice.receipts?.reduce((p, n) => p + n.amount, 0);

export const getInvoicesReceiptSum = (invoices: InvoiceOutDTO[]) => invoices.reduce((p, n) => p + getInvoiceReceiptSum(n), 0);
