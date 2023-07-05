import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React, { memo } from 'react';
import { Screens } from '../../Screens';
import FinancialScreen from './FinancialScreen';
import { useScreenOptions } from '../../useScreenOptions';
import { HeaderAddButton } from '../../../components/HeaderAddButton';
import EmployeeInvoiceListScreen from '../invoice/InvoiceListScreen';
import EmployeeInvoiceUpsertScreen from '../invoice/InvoiceUpsertScreen';
import EmployeeCostListScreen from '../cost/CostListScreen';
import EmployeeCostUpsertScreen from '../cost/CostUpsertScreen';
import EmployeeReceiptListScreen from '../receipt/ReceiptListScreen';
import EmployeeReceiptUpsertScreen from '../receipt/ReceiptUpsertScreen';

const Stack = createNativeStackNavigator();

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
        component={EmployeeInvoiceListScreen}
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
        component={EmployeeInvoiceUpsertScreen}
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
        name={Screens.APP_FINANCIAL_COST_LIST}
        component={EmployeeCostListScreen}
        options={(screenProps) => ({
          ...options('Costuri'),
          headerRight: (headerProps) => (
            <HeaderAddButton
              {...screenProps}
              {...headerProps}
              screenName={Screens.APP_FINANCIAL_COST_UPSERT}
            />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.APP_FINANCIAL_COST_UPSERT}
        component={EmployeeCostUpsertScreen}
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
        component={EmployeeReceiptListScreen}
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
        component={EmployeeReceiptUpsertScreen}
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
