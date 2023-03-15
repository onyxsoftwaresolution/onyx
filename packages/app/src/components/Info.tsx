import { APP_ENV, NODE_ENV } from "@env";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { Queries } from "../requests/queries";

export default memo(function Info() {
  const info = useQuery(Queries.getInfo({ enabled: true }))

  return (
    <View style={[{ paddingVertical: 10 }]}>
      <Text variant="bodySmall">app: {NODE_ENV}/{APP_ENV}</Text>
      <Text variant="bodySmall">api: {info?.data?.data?.NODE_ENV}</Text>
    </View>
  );
});
