import {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

export default class NavigationSettings {
  static NativeStackNavigationOptions(
    props: NativeStackScreenProps<any, string>,
    title: (props: NativeStackScreenProps<any, string>) => string,
  ): NativeStackNavigationOptions {
    return {};
  }
}
