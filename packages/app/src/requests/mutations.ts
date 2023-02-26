import { UseMutationOptions } from '@tanstack/react-query';
import { Store } from '../storage/Store';
import { mutationFn, request } from './request';

export class Mutations {
  static postLogin() {
    return {
      mutationKey: ['login'],
      mutationFn: async (body: any) => {
        return await mutationFn(
          `http://localhost:4000/v1/auth/login`,
          { body, method: 'POST' },
          (response) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
            Store.set('access_token', response.data?.access_token!);
          },
        );
      },
    } as UseMutationOptions;
  }

  static upsertEmployee() {
    return {
      mutationKey: ['employee'],
      mutationFn: async (body: any) => {
        return await mutationFn(`http://localhost:4000/v1/employee`, {
          body,
          method: 'PUT',
        });
      },
    } as UseMutationOptions;
  }

  static upsertActivityTemplate() {
    return {
      mutationKey: ['activity-template'],
      mutationFn: async (body: any) => {
        return await mutationFn(`http://localhost:4000/v1/activity-template`, {
          body,
          method: 'PUT',
        });
      },
    } as UseMutationOptions;
  }
}
