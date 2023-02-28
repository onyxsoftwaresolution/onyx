import { Dayjs } from "dayjs";

export const dayOrNull = (date: Dayjs): Dayjs | null => {
    if (!date.isValid()) return null;
    return date;
};
