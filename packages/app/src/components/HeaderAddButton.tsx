import {
  HeaderButtonProps,
  NativeStackScreenProps,
} from '@react-navigation/native-stack/lib/typescript/src/types';
import { Platform, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Screens } from '../screens/Screens';

export function HeaderAddButton(
  props: HeaderButtonProps &
    NativeStackScreenProps<any, string> & { screenName: Screens, params?: Record<string, any> },
) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => {
        props.navigation.navigate(props.screenName, props.params);
      }}
    >
      <Icon
        name="plus"
        style={{
          padding: Platform.OS === 'ios' ? 10 : 20,
          paddingRight: Platform.OS === 'ios' ? 0 : 20,
          color: Platform.OS === 'ios' ? colors.primary : colors.inverseSurface,
          fontSize: 18,
        }}
      />
    </TouchableOpacity>
  );
}
