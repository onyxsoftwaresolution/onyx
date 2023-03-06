import {
  createElement,
  FunctionComponent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { Button, ButtonProps, Dialog, Portal, Text } from 'react-native-paper';

export type RenderOptions = {
  onDismiss?: (() => void) | undefined;
  title?: ReactNode;
  message?: ReactNode;
  scrollMessage?: ReactNode;
  buttons?: (
    | (Omit<ButtonProps, 'children'> & {
      label?: ReactNode;
    })
    | FunctionComponent
  )[];
};

export type RenderOptionsFunction<T> = (data: T) => RenderOptions;

export function useDialog<T>() {
  const [isVisible, setVisible] = useState(false);
  const [data, setData] = useState<T>();

  const show = useCallback((data: T) => {
    setVisible(true);
    setData(data);
  }, []);
  const hide = useCallback(() => setVisible(false), []);

  const renderDialog = useCallback(
    (arg: RenderOptions | RenderOptionsFunction<T>) => {
      const options = typeof arg === 'function' ? arg(data as T) : arg;
      return (
        <Portal>
          <Dialog style={[{ maxHeight: "100%" }]} visible={isVisible} onDismiss={() => { hide(); options.onDismiss?.() }}>
            {options.title != null ? (
              <Dialog.Title style={[{ margin: 15 }]}>{options.title}</Dialog.Title>
            ) : null}
            {options.message != null && options.scrollMessage == null
              ? (
                <Dialog.Content>
                  <Text variant="bodyMedium">{options.message}</Text>
                </Dialog.Content>
              ) : null}
            {options.message == null && options.scrollMessage != null
              ? (
                <Dialog.ScrollArea style={[{ paddingHorizontal: 0, marginBottom: 0 }]}>
                  {options.scrollMessage}
                </Dialog.ScrollArea>
              )
              : null}
            <Dialog.Actions style={[{ padding: 10, paddingBottom: 10 }]}>
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
