import { useWindowDimensions } from "react-native";
import { useTheme } from "react-native-paper";
import { AppTheme } from "../../theme/type";

export const useIsMobile = () => {
  const dimensions = useWindowDimensions();
  const theme = useTheme<AppTheme>();
  return dimensions.width <= theme.breakpoint;
}
