import { memo, useState } from 'react';
import { TextInputProps, TextInput, useTheme } from 'react-native-paper';

export default memo<TextInputProps>(function MGTextInput(props) {
  const theme = useTheme();
  const [height, setHeight] = useState<number>();

  const { style, onChange, ...rest } = props;
  return (
    <TextInput
      mode="outlined"
      style={[
        {
          backgroundColor: theme.colors.surface,
          // backgroundColor: theme.colors.textInputColor,
          flex: 1,
          height: height ?? 40,
        },
        style,
      ]}
      activeUnderlineColor={theme.colors.inverseSurface}
      underlineStyle={[{ height: 0 }]}
      textColor={theme.colors.inverseSurface}
      onChange={e => {
        props.onChange?.(e);
        // setHeight(e.nativeEvent?.target?.scrollHeight ?? e.nativeEvent?.contentSize?.height);
      }}
      {...rest}
    />
  );
});
