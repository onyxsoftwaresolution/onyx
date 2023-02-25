import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import MGButton from '../../components/MGButton';
import MGTextInput from '../../components/MGTextInput';
import ScreenContainer from '../../components/ScreenContainer';

export default memo(function LoginScreen() {
  const theme = useTheme();

  return (
    <ScreenContainer scrollContainerStyle={styles.scrollContainer}>
      <View style={styles.view}>
        <MGTextInput style={{ marginBottom: 7 }} />
        <MGTextInput style={[{ marginBottom: 7 }]} />
        <MGButton label={'Login'} onPress={() => {}} />
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
    maxWidth: 300,
    width: '80%',
  },
});
