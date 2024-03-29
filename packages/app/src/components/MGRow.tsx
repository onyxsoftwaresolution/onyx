import React, { Fragment, memo, PropsWithChildren, useCallback, useMemo } from "react";
import { StyleProp, useWindowDimensions, View, ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";
import { AppTheme } from "../theme/type";

type Child = string | number | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal;

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export default memo<Props>(function MGRow(props) {
  const theme = useTheme<AppTheme>();
  const dimensions = useWindowDimensions();
  const flexDirection = dimensions.width >= theme.iphoneWidth ? 'row' : 'column';

  const spacer = useCallback((key: string) => {
    return (
      <View key={key} style={[{ width: 10 }]} />
    )
  }, []);

  const childWrapper = useCallback((child: Child, index: number) => {
    return (
      <View key={index} style={[{ flex: flexDirection === 'row' ? 1 : undefined }]}>
        {child}
      </View>
    );
  }, [flexDirection]);

  const children = useMemo(() => {
    return React.Children
      .toArray(props.children)
      .reduce((p: Child[], n: Child, index, list) => {
        p.push(childWrapper(n, index));
        if (index < list.length - 1)
          p.push(spacer(`spacer-${index}`));
        return p;
      }, [] as Child[]);
  }, [childWrapper, props.children, spacer]);

  return (
    <View
      style={[
        { flexDirection },
        props.style
      ]}
    >
      {children}
    </View>
  )
});
