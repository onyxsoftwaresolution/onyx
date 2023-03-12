import React, { useCallback, useMemo } from "react";
import { Portal, Snackbar } from "react-native-paper";

export const useSnackbar = () => {
  const [visible, setVisible] = React.useState(false);
  const [message, setMessage] = React.useState<React.ReactNode>();

  const toggle = useCallback(() => setVisible(!visible), [visible]);
  const show = useCallback((message?: React.ReactNode) => {
    setMessage(message);
    setVisible(true);
  }, []);
  const hide = useCallback(() => setVisible(false), []);

  const renderSnackbar = useCallback((text?: React.ReactNode) => (
    <Portal>
      <Snackbar
        visible={visible}
        onDismiss={hide}
        action={{
          label: '',
          icon: 'close',
          onPress: hide,
        }}>
        {message ?? text ?? ''}
      </Snackbar>
    </Portal>
  ), [hide, message, visible]);

  return useMemo(
    () => ({ renderSnackbar, show, hide, toggle }),
    [hide, renderSnackbar, show, toggle])
}
