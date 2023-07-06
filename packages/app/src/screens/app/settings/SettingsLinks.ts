import { Role } from "@workspace/api/prisma/prisma";
import { MenuItem, MenuItemData } from "../../../components/MenuItem";
import { AppTheme } from "../../../theme/type";
import { Screens } from "../../Screens";


export enum SettingLinks {
  EMPLOYEES,
  ACTIVITIES,
  USERS,
  CLIENTS,
  SUPPLIERS,
  CONTRACTS,
  PRODUCTS,
  LOGOUT,
  ABOUT,
}

export const settingMenuItems: MenuItem[] = [
  { label: 'Angajati', value: SettingLinks.EMPLOYEES, roles: [Role.ADMIN] },
  { label: 'Activitati', value: SettingLinks.ACTIVITIES, roles: [Role.ADMIN] },
  { label: 'Utilizatori', value: SettingLinks.USERS, roles: [Role.ADMIN] },
  { label: 'Clienti', value: SettingLinks.CLIENTS, roles: [Role.ADMIN] },
  { label: 'Furnizori', value: SettingLinks.SUPPLIERS, roles: [Role.ADMIN] },
  { label: 'Contracte', value: SettingLinks.CONTRACTS, roles: [Role.ADMIN] },
  { label: 'Produse', value: SettingLinks.PRODUCTS, roles: [Role.ADMIN] },
  { label: 'Despre aplicatie', value: SettingLinks.ABOUT, roles: [], hide: true },
  { label: 'Logout', value: SettingLinks.LOGOUT, roles: [] },
];

export const getSettingItemData = (
  item: (typeof settingMenuItems)[0],
  colors: AppTheme["colors"],
  navigation: any,
  logout: () => Promise<void>,
  showAboutDialog: () => void,
): MenuItemData => {
  switch (item.value) {
    case SettingLinks.LOGOUT:
      return {
        color: colors.danger,
        onPress: logout,
        icon: 'sign-out-alt',
        chevron: '',
        screen: '',
      };

    case SettingLinks.EMPLOYEES:
      return {
        color: colors.inverseSurface,
        onPress: () => {
          navigation.navigate(Screens.APP_SETTINGS_NAVIGATOR, {
            screen: Screens.APP_EMPLOYEE_LIST,
          });
        },
        icon: 'user-alt',
        chevron: 'chevron-right',
        screen: Screens.APP_EMPLOYEE_LIST,
      };

    case SettingLinks.ACTIVITIES:
      return {
        color: colors.inverseSurface,
        onPress: () => {
          navigation.navigate(Screens.APP_SETTINGS_NAVIGATOR, {
            screen: Screens.APP_ACTIVITY_TEMPLATE_LIST,
          });
        },
        icon: 'tools',
        chevron: 'chevron-right',
        screen: Screens.APP_ACTIVITY_TEMPLATE_LIST,
      };

    case SettingLinks.ABOUT:
      return {
        color: colors.inverseSurface,
        onPress: showAboutDialog,
        icon: 'mobile-alt',
        chevron: '',
        screen: '',
      }

    case SettingLinks.USERS:
      return {
        color: colors.inverseSurface,
        onPress: () => {
          navigation.navigate(Screens.APP_SETTINGS_NAVIGATOR, {
            screen: Screens.APP_USER_LIST,
          });
        },
        icon: 'user-lock',
        chevron: 'chevron-right',
        screen: Screens.APP_USER_LIST,
      }

    case SettingLinks.CLIENTS:
      return {
        color: colors.inverseSurface,
        onPress: () => {
          navigation.navigate(Screens.APP_SETTINGS_NAVIGATOR, {
            screen: Screens.APP_CLIENT_LIST,
          });
        },
        icon: 'fire',
        chevron: 'chevron-right',
        screen: Screens.APP_CLIENT_LIST,
      }

    case SettingLinks.SUPPLIERS:
      return {
        color: colors.inverseSurface,
        onPress: () => {
          navigation.navigate(Screens.APP_SETTINGS_NAVIGATOR, {
            screen: Screens.APP_SUPPLIER_LIST
          });
        },
        icon: 'parachute-box',
        chevron: 'chevron-right',
        screen: Screens.APP_SUPPLIER_LIST,
      }

    case SettingLinks.CONTRACTS:
      return {
        color: colors.inverseSurface,
        onPress: () => {
          navigation.navigate(Screens.APP_SETTINGS_NAVIGATOR, {
            screen: Screens.APP_CONTRACT_LIST
          });
        },
        icon: 'file-contract',
        chevron: 'chevron-right',
        screen: Screens.APP_CONTRACT_LIST,
      }

    case SettingLinks.PRODUCTS:
      return {
        color: colors.inverseSurface,
        onPress: () => {
          navigation.navigate(Screens.APP_SETTINGS_NAVIGATOR, {
            screen: Screens.APP_PRODUCT_LIST
          });
        },
        icon: 'product-hunt',
        chevron: 'chevron-right',
        screen: Screens.APP_PRODUCT_LIST,
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
