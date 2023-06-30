import { Role } from "@workspace/api/node_modules/@prisma/client";
import { MenuItem, MenuItemData } from "../../../components/MenuItem";
import { AppTheme } from "../../../theme/type";
import { Screens } from "../../Screens";

export enum FinancialLinks {
  INVOICES,
  COSTS,
  COLLECTIONS,
}

export const financialMenuItems: MenuItem[] = [
  { label: 'Facturi', value: FinancialLinks.INVOICES, roles: [Role.ADMIN] },
  { label: 'Costuri', value: FinancialLinks.COSTS, roles: [Role.ADMIN] },
  { label: 'Incasari', value: FinancialLinks.COLLECTIONS, roles: [Role.ADMIN] },
];

export const getFinancialItemData = (
  item: (typeof financialMenuItems)[0],
  colors: AppTheme["colors"],
  navigation: any,
): MenuItemData => {
  switch (item.value) {
    case FinancialLinks.INVOICES:
      return {
        color: colors.inverseSurface,
        onPress: () => {
          navigation.navigate(Screens.APP_FINANCIAL_NAVIGATOR, {
            screen: Screens.APP_FINANCIAL_INVOICE_LIST,
          });
        },
        icon: 'file-invoice',
        chevron: 'chevron-right',
        screen: Screens.APP_FINANCIAL_INVOICE_LIST,
      };

    case FinancialLinks.COSTS:
      return {
        color: colors.inverseSurface,
        onPress: () => {
          navigation.navigate(Screens.APP_FINANCIAL_NAVIGATOR, {
            screen: Screens.APP_FINANCIAL_COST_LIST,
          });
        },
        icon: 'euro-sign',
        chevron: 'chevron-right',
        screen: Screens.APP_FINANCIAL_COST_LIST,
      };

    case FinancialLinks.COLLECTIONS:
      return {
        color: colors.inverseSurface,
        onPress: () => {
          navigation.navigate(Screens.APP_FINANCIAL_NAVIGATOR, {
            screen: Screens.APP_FINANCIAL_COLLECTION_LIST,
          });
        },
        icon: 'euro-sign',
        chevron: 'chevron-right',
        screen: Screens.APP_FINANCIAL_COLLECTION_LIST,
      }

    default:
      return {
        color: colors.inverseSurface,
        onPress: () => { },
        icon: '',
        chevron: '',
        screen: '',
      };
  }
};
