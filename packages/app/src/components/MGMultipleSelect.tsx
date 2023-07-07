import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Fragment, memo, PropsWithChildren, useCallback, useEffect, useState } from "react";
import { RenderOptionsFunction, useDialog } from "./hooks/useDialog";
import { TouchableRipple, useTheme, Text, Checkbox, Divider } from "react-native-paper";
import { AppTheme } from "../theme/type";
import { StyleProp, View, ViewStyle } from "react-native";
import MGButton from "./MGButton";
import { ScrollView } from "react-native-gesture-handler";
import { FetchError, FetchResponse } from "../requests/request";
import { useIsFocused } from "@react-navigation/native";

type MultipleSelectProps<T extends { id?: number }> = PropsWithChildren & {
  data: T[];
  onSelect(data: T[] | undefined): void;
  getter(config?: { enabled: boolean }): UseQueryOptions<FetchResponse<T[]>, FetchError>;
  getText(data: T | undefined): string;
  getId(data: T | undefined): any;
  label?: string;
  type?: "button";
  containerStyle?: StyleProp<ViewStyle>;
  title?: string;
  error?: boolean;
}

export default memo(function MGMultipleSelect<T extends { id?: number }>(props: MultipleSelectProps<T>) {
  const type = props.type ?? "button";

  const isFocused = useIsFocused();
  const dialog = useDialog<void>();
  const { colors } = useTheme<AppTheme>()
  const [selected, setSelected] = useState<{ [id: number]: boolean }>({});
  const [disabled, setDisabled] = useState<{ [id: number]: boolean }>({});

  useEffect(() => {
    setDisabled(disabled => props.data.reduce((p, n) => { p[props.getId(n)] = true; return p; }, {} as { [id: number]: boolean }))
  }, [props.getId, props.data, props]);

  const datas = useQuery(props.getter({ enabled: dialog.isVisible && isFocused }));

  const onSelect = useCallback((a: T) => {
    setSelected(selected => ({
      ...selected,
      [props.getId(a)]: !!!selected[props.getId(a)],
    }));
  }, [props]);

  const onSubmit = useCallback(() => {
    props.onSelect(datas.data?.data.filter(item => selected[props.getId(item)] === true));
    setSelected({});
  }, [datas.data?.data, props, selected]);

  const onDismiss = useCallback(() => {
    setSelected({});
  }, []);

  const dialogRenderOptions: RenderOptionsFunction<void> = useCallback(() => ({
    title: props.title,
    scrollMessage: (
      <ScrollView style={[{ width: "100%" }]}>
        {datas?.data?.data?.filter(a => disabled[props.getId(a)] !== true).map((a, i) => (
          <Fragment key={`${props.getId(a) ?? JSON.stringify(a)}`}>
            {i > 0 && <Divider />}
            <TouchableRipple style={[{ width: "100%", padding: 10 }]} onPress={() => onSelect(a)}>
              <View style={[{ flexDirection: "row", width: "100%" }]}>
                <View pointerEvents="none">
                  <Checkbox status={selected[props.getId(a)] === true ? "checked" : "unchecked"} />
                </View>
                <View style={[{ justifyContent: "center", flex: 1 }]}><Text>{props.getText(a)}</Text></View>
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
        disabled: Object.keys(selected).length === 0,
      },
      () => <View style={{ flex: 1 }} />,
      {
        label: 'Cancel',
        onPress: onDismiss,
      },
    ],
    onDismiss,
  }), [props, datas?.data?.data, colors.danger, onSubmit, selected, onDismiss, disabled, onSelect]);

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
      </View>
      {dialog.renderDialog(dialogRenderOptions)}
    </>
  );
});
