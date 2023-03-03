import { memo, useCallback, useState } from "react";
import { StyleProp, TextStyle, View } from "react-native";
import { Portal, TextInputProps, TouchableRipple, Text } from "react-native-paper";
import { enGB, registerTranslation, DatePickerModal, DatePickerModalSingleProps } from "react-native-paper-dates";
import { MultiConfirm, ValidRangeType } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import dayjs from "dayjs";
import { dayOrNull } from "../dayOrNull";

registerTranslation('en-GB', enGB);

interface MGDatePickerProps extends Pick<DatePickerModalSingleProps, "uppercase" | "startYear" | "endYear"> {
  value?: Date | null;
  defaultValue?: Date;
  onDateChange?: MultiConfirm;
  mode: 'range' | 'single' | 'multiple';
  inputMode?: TextInputProps["mode"];
  label?: string;
  placeholder?: string;
  error?: boolean;
  validRange?: ValidRangeType | undefined;
  inputStyle?: StyleProp<TextStyle>;
}

export default memo<MGDatePickerProps>(function MGDatePicker(props) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);

  const showDatePicker = useCallback(() => {
    setDatePickerVisibility(true);
  }, []);

  const onConfirm: MultiConfirm = useCallback(
    (params) => {
      setDatePickerVisibility(false);
      props.onDateChange?.(params);
    },
    [props],
  );

  const onDismiss = useCallback(() => {
    setDatePickerVisibility(false);
  }, [setDatePickerVisibility]);

  return (
    <View>
      <TouchableRipple onPress={showDatePicker}>
        <View style={[{ backgroundColor: '#fff' }]}>
          <Text style={[{ fontSize: 15, color: '#000', padding: 10, paddingHorizontal: 16 }]}>{dayOrNull(dayjs(props.value))?.format('DD/MM/YYYY') ?? ""}</Text>
        </View>
      </TouchableRipple>
      <Portal>
        <DatePickerModal
          locale={'en-GB'}
          visible={isDatePickerVisible}
          date={props.value ?? props.defaultValue}
          mode={props.mode as "multiple"}
          onConfirm={onConfirm}
          label={props.label}
          onDismiss={onDismiss}
          validRange={props.validRange}
          saveLabel={"SAVE"}
          uppercase={props.uppercase}
          startYear={props.startYear}
          endYear={props.endYear}
        />
      </Portal>
    </View>
  );
});