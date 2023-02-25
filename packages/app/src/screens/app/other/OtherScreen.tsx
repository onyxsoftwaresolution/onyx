import React, { memo, useCallback } from 'react';
import ScreenContainer from '../../../components/ScreenContainer';
import { useTheme } from 'react-native-paper';
import MGButton from '../../../components/MGButton';
import { useUser } from '../../../context/userContext';
import { Store } from '../../../storage/Store';

export default memo(function OtherScreen() {
  const { colors } = useTheme();
  const [, setUser] = useUser();

  const logout = useCallback(async () => {
    await Store.delete('access_token');
    setUser?.(undefined);
  }, [setUser]);

  return (
    <ScreenContainer>
      <MGButton label="logout" onPress={logout} />
    </ScreenContainer>
  );
});
