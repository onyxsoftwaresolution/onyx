import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React, { memo } from 'react';
import { Screens } from '../../Screens';
import FinancialScreen from './FinancialScreen';
import { useScreenOptions } from '../../useScreenOptions';
import { HeaderAddButton } from '../../../components/HeaderAddButton';
import InvoiceListScreen from '../invoice/InvoiceListScreen';
import InvoiceUpsertScreen from '../invoice/InvoiceUpsertScreen';
import CostListScreen from '../cost/CostListScreen';
import CostUpsertScreen from '../cost/CostUpsertScreen';
import ReceiptListScreen from '../receipt/ReceiptListScreen';
import ReceiptUpsertScreen from '../receipt/ReceiptUpsertScreen';
import ProjectListScreen from '../projects/ProjectListScreen';
import ProjectActivityListScreen from '../projects/ProjectActivityListScreen';

const Stack = createNativeStackNavigator();

const CostProjectListScreen = memo((props: any) => <ProjectListScreen {...props} type={'cost'} />);
const CostProjectActivityListScreen = memo((props: any) => <ProjectActivityListScreen {...props} type={'cost'} />);

export default memo(function FinancialStackNavigator() {
  const options = useScreenOptions();

  return (
    <Stack.Navigator
      initialRouteName={Screens.APP_FINANCIAL_SCREEN}
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen
        name={Screens.APP_FINANCIAL_SCREEN}
        component={FinancialScreen}
        options={options('Financiar')}
      />
      <Stack.Screen
        name={Screens.APP_FINANCIAL_INVOICE_LIST}
        component={InvoiceListScreen}
        options={(screenProps) => ({
          ...options('Facturi'),
          headerRight: (headerProps) => (
            <HeaderAddButton
              {...screenProps}
              {...headerProps}
              screenName={Screens.APP_FINANCIAL_INVOICE_UPSERT}
            />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.APP_FINANCIAL_INVOICE_UPSERT}
        component={InvoiceUpsertScreen}
        options={(screenProps) => ({
          ...options(''),
          title:
            // @ts-expect-error missing type
            screenProps.route.params?.name != null
              ? 'Modifica factura'
              : 'Adauga factura',
        })}
      />
      <Stack.Screen
        name={Screens.APP_COST_PROJECT_LIST}
        component={CostProjectListScreen}
        options={(screenProps) => ({
          ...options('Alege un proiect...'),
        })}
      />
      <Stack.Screen
        name={Screens.APP_COST_PROJECT_ACTIVITY_LIST}
        component={CostProjectActivityListScreen}
        options={(screenProps) => ({
          ...options('Alege o activitate...'),
        })}
      />
      <Stack.Screen
        name={Screens.APP_COST_LIST}
        component={CostListScreen}
        options={(screenProps) => ({
          ...options('Costuri'),
          headerRight: (headerProps) => (
            <HeaderAddButton
              {...screenProps}
              {...headerProps}
              screenName={Screens.APP_COST_UPSERT}
              // @ts-expect-error missing type
              params={{ projectActivityId: screenProps.route.params?.activityId }}
            />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.APP_COST_UPSERT}
        component={CostUpsertScreen}
        options={(screenProps) => ({
          ...options(''),
          title:
            // @ts-expect-error missing type
            screenProps.route.params?.name != null
              ? 'Modifica cost'
              : 'Adauga cost',
        })}
      />
      <Stack.Screen
        name={Screens.APP_FINANCIAL_RECEIPT_LIST}
        component={ReceiptListScreen}
        options={(screenProps) => ({
          ...options('Incasari'),
          headerRight: (headerProps) => (
            <HeaderAddButton
              {...screenProps}
              {...headerProps}
              screenName={Screens.APP_FINANCIAL_RECEIPT_UPSERT}
            />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.APP_FINANCIAL_RECEIPT_UPSERT}
        component={ReceiptUpsertScreen}
        options={(screenProps) => ({
          ...options(''),
          title:
            // @ts-expect-error missing type
            screenProps.route.params?.name != null
              ? 'Modifica incasare'
              : 'Adauga incasare',
        })}
      />
    </Stack.Navigator>
  );
});
