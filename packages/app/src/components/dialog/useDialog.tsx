import {
  createElement,
  FunctionComponent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Button, ButtonProps, Dialog, Portal, Text } from 'react-native-paper';

export function useDialog<T>() {
  const [isVisible, setVisible] = useState(false);
  const [data, setData] = useState<T>();

  const show = useCallback((data: T | undefined) => {
    setVisible(true);
    setData(data);
  }, []);
  const hide = useCallback(() => setVisible(false), []);

  const renderDialog = useCallback(
    (
      title?: ReactNode | ((data: T | undefined) => ReactNode),
      message?: ReactNode | ((data: T | undefined) => ReactNode),
      buttons?: (
        | (Omit<ButtonProps, 'children'> & {
            label?: ReactNode;
          })
        | FunctionComponent
      )[],
    ) => (
      <Portal>
        <Dialog visible={isVisible} onDismiss={hide}>
          {title != null ? (
            <Dialog.Title>
              {typeof title === 'function' ? title(data) : title}
            </Dialog.Title>
          ) : null}
          {message != null ? (
            <Dialog.Content>
              <Text variant="bodyMedium">
                {typeof message === 'function' ? message(data) : message}
              </Text>
            </Dialog.Content>
          ) : null}
          <Dialog.Actions>
            {buttons?.map((button, i) =>
              typeof button === 'function' ? (
                createElement(button, { key: i * 1 })
              ) : (
                <Button
                  key={i}
                  {...button}
                  onPress={(e) => {
                    button?.onPress?.(e);
                    hide();
                  }}
                >
                  {button?.label}
                </Button>
              ),
            )}
          </Dialog.Actions>
        </Dialog>
      </Portal>
    ),
    [data, hide, isVisible],
  );

  return useMemo(
    () => ({ isVisible, show, hide, renderDialog }),
    [hide, isVisible, renderDialog, show],
  );
}
