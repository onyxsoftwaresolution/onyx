import { memo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { TextInputProps, TextInput, useTheme } from 'react-native-paper';

export default memo<TextInputProps & { containerStyle?: StyleProp<ViewStyle> }>(function MGTextInput(props) {
  const theme = useTheme();

  const { style, onChange, ...rest } = props;
  return (
    <View style={[{ flex: 1 }, props.containerStyle]}>
      <TextInput
        mode="outlined"
        style={[
          {
            backgroundColor: theme.colors.surface,
            // backgroundColor: theme.colors.textInputColor,
            height: 40,
          },
          style,
        ]}
        activeUnderlineColor={theme.colors.inverseSurface}
        underlineStyle={[{ height: 0 }]}
        textColor={theme.colors.inverseSurface}
        {...rest}
      />
    </View>
  );
});
