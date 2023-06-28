import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React, { memo } from 'react';
import { HeaderAddButton } from '../../../components/HeaderAddButton';
import { Screens } from '../../Screens';
import { useScreenOptions } from '../../useScreenOptions';
import ContractListScreen from './ContractListScreen';
import ContractUpsertScreen from './ContractUpsertScreen';

const Stack = createNativeStackNavigator();

const component = memo((props: any) => <ContractListScreen {...props} type="contract" />)

export default memo(function ContractStackNavigator() {
  const options = useScreenOptions();

  return (
    <Stack.Navigator initialRouteName={Screens.APP_CONTRACT_LIST} screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name={Screens.APP_CONTRACT_LIST}
        component={component}
        options={(screenProps) => ({
          ...options('Contracte'),
          headerRight: (headerProps) => (
            <HeaderAddButton
              {...screenProps}
              {...headerProps}
              screenName={Screens.APP_CONTRACT_UPSERT}
              params={{}}
            />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.APP_CONTRACT_UPSERT}
        component={ContractUpsertScreen}
        options={screenProps => {
          return ({
            ...options(''),
            title:
              // @ts-expect-error missing type
              screenProps.route.params?.id != null
                ? 'Modifica contract'
                : 'Adauga contract',
          })
        }}
      />
    </Stack.Navigator>
  );
});
