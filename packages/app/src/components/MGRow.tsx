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

  const spacer = useCallback((key: string) => {
    return (
      <View key={key} style={[{ width: 10 }]} />
    )
  }, []);

  const children = useMemo(() => {
    return React.Children
      .toArray(props.children)
      .reduce((p: Child[], n: Child, index, list) => {
        p.push(<Fragment key={`${index}`}>{n}</Fragment>)
        if (index < list.length - 1)
          p.push(spacer(`spacer-${index}`));
        return p;
      }, [] as Child[]);
  }, [props.children, spacer]);

  return (
    <View style={[{ flexDirection: dimensions.width >= theme.iphoneWidth ? 'row' : 'column' }, props.style]}>
      {children}
    </View>
  )
});
