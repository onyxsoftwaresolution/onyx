import { UseMutationOptions } from '@tanstack/react-query';
import { Store } from '../storage/Store';
import { request } from './request';

export class Mutations {
  static postLogin() {
    return {
      mutationKey: ['login'],
      mutationFn: async (body: any) => {
        const result = await request(`http://localhost:4000/v1/auth/login`, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
          },
        });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        Store.set('access_token', result.data?.access_token!);
        return result;
      },
    } as UseMutationOptions;
  }
}
