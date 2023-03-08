import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { useCallback } from "react";
import { Platform } from "react-native";
import { useTheme } from "react-native-paper";

export const useScreenOptions = () => {
  const { colors } = useTheme();

  return useCallback(
    (title: string): NativeStackNavigationOptions => ({
      title,
      headerStyle: { backgroundColor: colors.surface },
      headerTitleStyle: { color: colors.inverseSurface },
      headerTintColor:
        Platform.OS === 'ios' ? colors.primary : colors.inverseSurface,
    }),
    [colors.inverseSurface, colors.primary, colors.surface],
  );
}
