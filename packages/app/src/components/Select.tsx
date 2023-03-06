import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Fragment, memo, PropsWithChildren, useCallback, useState } from "react";
import { RenderOptionsFunction, useDialog } from "./dialog/useDialog";
import { TouchableRipple, useTheme, Text, RadioButton, Divider } from "react-native-paper";
import { AppTheme } from "../theme/type";
import { StyleProp, View, ViewStyle } from "react-native";
import MGButton from "./MGButton";
import { ScrollView } from "react-native-gesture-handler";
import { FetchError, FetchResponse } from "../requests/request";
import MGTextInput from "./MGTextInput";

type SelectProps<T extends { id: number }> = PropsWithChildren & {
  onSelect(data: T | undefined): void;
  getter(): UseQueryOptions<FetchResponse<T[]>, FetchError>;
  text(data: T | undefined): string;
  label?: string;
  type?: "button" | "input";
  containerStyle?: StyleProp<ViewStyle>;
}

export default memo(function Select<T extends { id: number }>(props: SelectProps<T>) {
  const type = props.type ?? "button";

  const dialog = useDialog<void>();
  const { colors } = useTheme<AppTheme>()
  const [data, setData] = useState<T>();

  const datas = useQuery(props.getter());

  const dialogRenderOptions: RenderOptionsFunction<void> =
    useCallback(
      () => ({
        title: `Select Activity`,
        scrollMessage: (
          <ScrollView style={[{ width: "100%" }]}>
            {datas?.data?.data?.map((a, i) => (
              <Fragment key={a.id}>
                {i > 0 && <Divider />}
                <TouchableRipple style={[{ width: "100%", padding: 10 }]} onPress={() => setData(a)}>
                  <View style={[{ flexDirection: "row", width: "100%" }]}>
                    <RadioButton status={a.id === data?.id ? "checked" : "unchecked"} value="first" />
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
            onPress: () => { props.onSelect(data); },
          },
          () => <View style={{ flex: 1 }} />,
          {
            label: 'Cancel',
            onPress: () => { },
          },
        ],
        onDismiss: () => { },
      }),
      [datas?.data?.data, colors.danger, data, props],
    );

  return (
    <>
      <View style={[props.containerStyle]}>
        {type === "button" ? <MGButton icon={"plus"} label={props.label} onPress={() => dialog.show(undefined)} /> : null}
        {type === "input" ? <MGTextInput value={props.text(data)} onChangeText={() => { }} label={props.label} onFocus={() => dialog.show(undefined)} /> : null}
      </View>
      {dialog.renderDialog(dialogRenderOptions)}
    </>
  );
});
