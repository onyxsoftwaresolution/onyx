import { memo, useCallback, useState } from "react";
import { StyleProp, TextStyle, TouchableWithoutFeedback, View } from "react-native";
import { Portal, TextInput, TextInputProps } from "react-native-paper";
import { DatePickerModal, DatePickerModalSingleProps } from "react-native-paper-dates";
import { MultiConfirm, ValidRangeType } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import dayjs from "dayjs";
import { dayOrNull } from "../dayOrNull";

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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

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
      <TouchableWithoutFeedback onPress={showDatePicker}>
        <TextInput
          value={dayOrNull(dayjs(props.value))?.format('DD/MM/YYYY') ?? ""}
          label={props.label}
          mode={props.inputMode ?? "outlined"}
          placeholder={props.placeholder}
          editable={false}
          style={[props.inputStyle]}
          error={!!props.error}
        />
      </TouchableWithoutFeedback>
      <Portal>
        <DatePickerModal
          locale={'en'}
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