import dayjs from "dayjs";
import { dayOrNull } from "./dayOrNull";

export const getHumanReadableDate = (date: any) => dayOrNull(dayjs(date))?.format('DD/MM/YYYY') ?? '';
