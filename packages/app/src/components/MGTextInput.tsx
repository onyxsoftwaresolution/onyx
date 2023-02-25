import { memo } from 'react';
import { TextInputProps, TextInput, useTheme } from 'react-native-paper';

export default memo<TextInputProps>(function MGTextInput(props) {
  const theme = useTheme();
  const { style, ...rest } = props;
  return (
    <TextInput
      mode="flat"
      style={[
        {
          backgroundColor: theme.colors.inverseSurface,
          // backgroundColor: theme.colors.textInputColor,
          width: '100%',
          height: 40,
        },
        style,
      ]}
      activeUnderlineColor={theme.colors.surface}
      underlineStyle={[{ height: 0 }]}
      textColor={theme.colors.surface}
      {...rest}
    />
  );
});
