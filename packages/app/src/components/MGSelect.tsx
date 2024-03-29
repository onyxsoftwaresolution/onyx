import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Fragment, memo, PropsWithChildren, useCallback, useState } from "react";
import { RenderOptionsFunction, useDialog } from "./hooks/useDialog";
import { TouchableRipple, useTheme, Text, RadioButton, Divider } from "react-native-paper";
import { AppTheme } from "../theme/type";
import { StyleProp, View, ViewStyle } from "react-native";
import MGButton from "./MGButton";
import { ScrollView } from "react-native-gesture-handler";
import { FetchError, FetchResponse } from "../requests/request";
import MGTextInput from "./MGTextInput";
import { isObject } from "class-validator";
import { useIsFocused } from "@react-navigation/native";

type SelectProps<T extends { id?: number }> = PropsWithChildren & {
  data: T | undefined;
  onSelect(data: T | undefined): void;
  getter(config?: { enabled: boolean }): UseQueryOptions<FetchResponse<T[]>, FetchError>;
  text(data: T | undefined): string;
  label?: string;
  type?: "button" | "input";
  containerStyle?: StyleProp<ViewStyle>;
  title?: string;
  error?: boolean;
}

export default memo(function MGSelect<T extends { id?: number }>(props: SelectProps<T>) {
  const type = props.type ?? "button";

  const isFocused = useIsFocused();
  const dialog = useDialog<void>();
  const { colors } = useTheme<AppTheme>()
  const [data, setData] = useState<T>();

  const datas = useQuery(props.getter({ enabled: dialog.isVisible && isFocused }));

  const onSelect = useCallback((a: T) => {
    setData(a);
  }, []);

  const onSubmit = useCallback(() => {
    props.onSelect(data); type === "button" && setData(undefined);
  }, [data, props, type]);

  const onDismiss = useCallback(() => {
    setData(undefined);
  }, []);

  const dialogRenderOptions: RenderOptionsFunction<void> = useCallback(() => ({
    title: props.title,
    scrollMessage: (
      <ScrollView style={[{ width: "100%" }]}>
        {datas?.data?.data?.map((a, i) => (
          <Fragment key={`${a.id ?? a}`}>
            {i > 0 && <Divider />}
            <TouchableRipple style={[{ width: "100%", padding: 10 }]} onPress={() => onSelect(a)}>
              <View style={[{ flexDirection: "row", width: "100%" }]}>
                <View pointerEvents="none">
                  <RadioButton status={a == data || (isObject(a) && a.id === data?.id) ? "checked" : "unchecked"} value="first" />
                </View>
                <View style={[{ justifyContent: "center", flex: 1 }]}><Text>{props.text(a)}</Text></View>
              </View>
            </TouchableRipple>
            {i < datas?.data?.data?.length - 1 && <Divider />}
          </Fragment>
        ))}
      </ScrollView>
    ),
    buttons: [
      {
        label: 'Select',
        textColor: colors.danger,
        onPress: onSubmit,
        disabled: data == null,
      },
      () => <View style={{ flex: 1 }} />,
      {
        label: 'Cancel',
        onPress: onDismiss,
      },
    ],
    onDismiss,
  }), [datas?.data?.data, colors.danger, onSubmit, data, onDismiss, props, onSelect]);

  return (
    <>
      <View style={[{ flex: 1 }, props.containerStyle]}>
        {type === "button"
          ? <MGButton
            icon={"plus"}
            label={props.label}
            onPress={() => dialog.show(undefined)}
          />
          : null}
        {type === "input"
          ? <TouchableRipple style={[{ flex: 1 }]} onPress={() => dialog.show(undefined)}>
            <View pointerEvents="none" style={[{ flex: 1 }]}>
              <MGTextInput
                error={props.error}
                style={[{ flex: 1 }]}
                value={props.text(props.data)}
                onChangeText={() => {/**/ }}
                label={props.label}
              />
            </View>
          </TouchableRipple>
          : null}
      </View>
      {dialog.renderDialog(dialogRenderOptions)}
    </>
  );
});
