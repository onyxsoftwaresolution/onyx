import { memo, useCallback, useState } from "react";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { Portal, TextInputProps, TouchableRipple, Text } from "react-native-paper";
import { enGB, registerTranslation, DatePickerModal, DatePickerModalSingleProps } from "react-native-paper-dates";
import { SingleChange, ValidRangeType } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import dayjs from "dayjs";
import { dayOrNull } from "../dayOrNull";
import MGTextInput from "./MGTextInput";

registerTranslation('en-GB', enGB);

interface MGDatePickerProps extends Pick<DatePickerModalSingleProps, "uppercase" | "startYear" | "endYear"> {
  value?: Date | null;
  defaultValue?: Date;
  onDateChange?: SingleChange;
  mode: 'range' | 'single' | 'multiple';
  inputMode?: TextInputProps["mode"];
  label?: string;
  placeholder?: string;
  error?: boolean;
  validRange?: ValidRangeType | undefined;
  inputStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export default memo<MGDatePickerProps>(function MGDatePicker(props) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);

  const showDatePicker = useCallback(() => {
    setDatePickerVisibility(true);
  }, []);

  const onConfirm: SingleChange = useCallback(
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
    <View style={[props.containerStyle]}>
      <TouchableRipple onPress={showDatePicker}>
        <View pointerEvents="none">
          <MGTextInput
            value={dayOrNull(dayjs(props.value ?? ''))?.format('DD/MM/YYYY') ?? ""}
            label={props.label}
          />
        </View>
      </TouchableRipple>
      <Portal>
        <DatePickerModal
          locale={'en-GB'}
          visible={isDatePickerVisible}
          date={props.value ?? props.defaultValue ?? dayjs().toDate()}
          mode={props.mode as "single"}
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