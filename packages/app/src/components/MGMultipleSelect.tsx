import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Fragment, memo, PropsWithChildren, useCallback, useState } from "react";
import { RenderOptionsFunction, useDialog } from "./hooks/useDialog";
import { TouchableRipple, useTheme, Text, Checkbox, Divider } from "react-native-paper";
import { AppTheme } from "../theme/type";
import { StyleProp, View, ViewStyle } from "react-native";
import MGButton from "./MGButton";
import { ScrollView } from "react-native-gesture-handler";
import { FetchError, FetchResponse } from "../requests/request";
import { isObject } from "class-validator";

type MultipleSelectProps<T extends { id?: number }> = PropsWithChildren & {
  onSelect(data: T[] | undefined): void;
  getter(): UseQueryOptions<FetchResponse<T[]>, FetchError>;
  text(data: T | undefined): string;
  label?: string;
  type?: "button";
  containerStyle?: StyleProp<ViewStyle>;
  title?: string;
  error?: boolean;
}

export default memo(function MGMultipleSelect<T extends { id?: number }>(props: MultipleSelectProps<T>) {
  const type = props.type ?? "button";

  const dialog = useDialog<void>();
  const { colors } = useTheme<AppTheme>()
  const [selected, setSelected] = useState<{ [id: number]: boolean }>({});

  const datas = useQuery(props.getter());

  const onSelect = useCallback((a: T) => {
    setSelected(selected => ({
      ...selected,
      [a.id!]: !!!selected[a.id!],
    }));
  }, []);

  const onSubmit = useCallback(() => {
    props.onSelect(datas.data?.data.filter(item => selected[item.id!] === true));
    setSelected({});
  }, [datas.data?.data, props, selected]);

  const onDismiss = useCallback(() => {
    setSelected({});
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
                  <Checkbox status={selected[a.id!] === true ? "checked" : "unchecked"} />
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
        disabled: Object.keys(selected).length === 0,
      },
      () => <View style={{ flex: 1 }} />,
      {
        label: 'Cancel',
        onPress: onDismiss,
      },
    ],
    onDismiss,
  }), [props.title, datas?.data?.data, colors.danger, onSubmit, onDismiss, selected, onSelect]);

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
