import { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';

export default memo(function LoadingScreen() {
  const theme = useTheme();

  return (
    <View style={[{ backgroundColor: theme.colors.surface }, styles.view]}>
      <ActivityIndicator
        color={theme.colors.inverseSurface}
        style={[styles.indicator]}
        size={'large'}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  view: {
    alignItems: 'stretch',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  indicator: {
    alignSelf: 'center',
  },
});
