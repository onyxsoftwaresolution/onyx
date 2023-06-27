export type MenuItem = {
  label: string,
  value: number,
  roles: string[],
  hide?: boolean,
};

export type MenuItemData = {
  color: string;
  onPress: () => void;
  icon: string;
  chevron: string;
  screen: string;
};
