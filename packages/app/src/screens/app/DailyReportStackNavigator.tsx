import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { memo } from 'react';
import NotInplementedScreen from '../NotInplementedScreen';
import { Screens } from '../Screens';

const Stack = createNativeStackNavigator();

export default memo(function DailyReportStackNavigator(props) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={Screens.APP_DAILY_REPORT_SCREEN}
        component={NotInplementedScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
});
