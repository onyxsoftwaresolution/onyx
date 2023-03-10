import { memo, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleProp,
  ViewStyle,
  StyleSheet,
  View,
} from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';

type Props = React.PropsWithChildren<{
  safeAreaStyle?: StyleProp<ViewStyle>;
  scrollStyle?: StyleProp<ViewStyle>;
  scrollContainerStyle?: StyleProp<ViewStyle>;
  loading?: boolean;
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
    <SafeAreaView style={[style, styles.safe, props.safeAreaStyle]}>
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
      {props.loading
        ? <View style={[styles.indicatorContainer]}>
          <ActivityIndicator
            color={theme.colors.inverseSurface}
            style={[styles.indicator]}
            size={'large'}
          />
        </View> : null}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  scroll: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {},
  indicatorContainer: {
    backgroundColor: '#00000063',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    alignSelf: 'center',
  },
});
