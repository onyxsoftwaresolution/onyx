import { memo } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Card } from "react-native-paper";

type Props = React.PropsWithChildren<{
  title?: React.ReactNode;
  cardStyle?: StyleProp<ViewStyle>;
  cardTitleStyle?: StyleProp<ViewStyle>;
  cardContentStyle?: StyleProp<ViewStyle>;
}>

export default memo<Props>(function MGCard(props) {
  return (
    <View style={[{ width: '100%', marginTop: 10 }]}>
      <Card style={[{ marginHorizontal: 10, flex: 1 }, props.cardStyle]}>
        {props.title && <Card.Title style={[props.cardTitleStyle]} title={props.title} />}
        <Card.Content style={[props.cardContentStyle]}>
          {props.children}
        </Card.Content>
      </Card>
    </View>
  );
})
