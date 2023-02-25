import React, { memo } from 'react';
import { Button, ButtonProps, useTheme } from 'react-native-paper';

type Props = React.PropsWithChildren<
  Omit<ButtonProps, 'children'> & { label?: string }
>;

export default memo<Props>(function MGButton(props) {
  const theme = useTheme();
  const { style, ...rest } = props;
  return (
    <Button
      mode="contained-tonal"
      style={[{ backgroundColor: theme.colors.primary }, style]}
      labelStyle={[{ color: theme.colors.inverseSurface }]}
      {...rest}
    >
      {props.children ?? props.label}
    </Button>
  );
});
