import { isEmpty, isUUID } from "class-validator";

// export const getInvoiceNumberFormatter = (number: string) => isEmpty(number) || isUUID(number) ? '(autogenerat)' : number;

export const getInvoiceNumberFormatter = (number: string) => number;
