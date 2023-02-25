import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import ScreenContainer from '../components/ScreenContainer';

export default memo(function NotInplementedScreen() {
  const theme = useTheme();
  return (
    <ScreenContainer scrollContainerStyle={styles.scrollContainer}>
      <View style={[styles.view]}>
        <Text style={[{ color: theme.colors.inverseSurface }]}>
          Screen Not Inplemented!
        </Text>
      </View>
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'stretch',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  view: {
    alignSelf: 'center',
  },
});
