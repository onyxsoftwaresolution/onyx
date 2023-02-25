import { memo, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { useTheme } from 'react-native-paper';

type Props = React.PropsWithChildren<{
  safeAreaStyle?: StyleProp<ViewStyle>;
  scrollStyle?: StyleProp<ViewStyle>;
  scrollContainerStyle?: StyleProp<ViewStyle>;
}>;

export default memo<Props>(function ScreenContainer(props) {
  const theme = useTheme();

  const style: ViewStyle = useMemo(
    () => ({
      backgroundColor: theme.colors.surface,
    }),
    [theme.colors.surface],
  );

  return (
    <SafeAreaView style={[style, styles.scroll, props.safeAreaStyle]}>
      <ScrollView
        style={[style, styles.scroll, props.scrollStyle]}
        contentContainerStyle={[
          style,
          styles.scrollContainer,
          props.scrollContainerStyle,
        ]}
      >
        {props.children}
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {},
});
