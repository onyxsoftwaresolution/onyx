import {
  createElement,
  FunctionComponent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Button, ButtonProps, Dialog, Portal, Text } from 'react-native-paper';

export type RenderOptions = {
  title?: ReactNode;
  message?: ReactNode;
  buttons?: (
    | (Omit<ButtonProps, 'children'> & {
        label?: ReactNode;
      })
    | FunctionComponent
  )[];
};

type RenderOptionsFunction<T> = (data: T | undefined) => RenderOptions;

export function useDialog<T>() {
  const [isVisible, setVisible] = useState(false);
  const [data, setData] = useState<T>();

  const show = useCallback((data: T | undefined) => {
    setVisible(true);
    setData(data);
  }, []);
  const hide = useCallback(() => setVisible(false), []);

  const renderDialog = useCallback(
    (arg: RenderOptions | RenderOptionsFunction<T>) => {
      const options = typeof arg === 'function' ? arg(data) : arg;
      return (
        <Portal>
          <Dialog visible={isVisible} onDismiss={hide}>
            {options.title != null ? (
              <Dialog.Title>{options.title}</Dialog.Title>
            ) : null}
            {options.message != null ? (
              <Dialog.Content>
                <Text variant="bodyMedium">{options.message}</Text>
              </Dialog.Content>
            ) : null}
            <Dialog.Actions>
              {options.buttons?.map((button, i) =>
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
      );
    },
    [data, hide, isVisible],
  );

  return useMemo(
    () => ({ isVisible, show, hide, renderDialog }),
    [hide, isVisible, renderDialog, show],
  );
}
