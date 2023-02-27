import { UseMutationOptions } from '@tanstack/react-query';
import { Store } from '../storage/Store';
import { request } from './request';

type Options = Partial<Pick<UseMutationOptions, 'onError' | 'onSuccess'>> & {
  onLoading?: () => void;
};

export class Mutations {
  static postLogin() {
    return {
      mutationKey: ['login'],
      mutationFn: async (body: any) => {
        return await Mutations.mutationFn(
          `http://192.168.0.102:4000/v1/auth/login`,
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
        return await Mutations.mutationFn(
          `http://192.168.0.102:4000/v1/employee`,
          {
            body,
            method: 'PUT',
          },
        );
      },
    } as UseMutationOptions;
  }

  static upsertActivityTemplate() {
    return {
      mutationKey: ['activity-template'],
      mutationFn: async (body: any) => {
        return await Mutations.mutationFn(
          `http://192.168.0.102:4000/v1/activity-template`,
          {
            body,
            method: 'PUT',
          },
        );
      },
    } as UseMutationOptions;
  }

  static deleteProject({ onError, onLoading, onSuccess }: Options = {}) {
    return {
      mutationKey: ['project'],
      mutationFn: async (id) => {
        onLoading?.();
        return await Mutations.mutationFn(
          `http://192.168.0.102:4000/v1/project/${id}`,
          {
            method: 'DELETE',
          },
        );
      },
      onSuccess,
      onError,
    } as UseMutationOptions<unknown, unknown, number, unknown>;
  }

  static mutationFn = async (
    input: RequestInfo,
    init?: RequestInit,
    onSuccess?: (result: unknown) => void,
  ) => {
    const token = await Store.get('access_token');
    const auth =
      token != null
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {};
    const response = await request(input, {
      ...init,
      body: JSON.stringify(init?.body),
      headers: {
        ...auth,
        'content-type': 'application/json',
        ...init?.headers,
      } as any,
    });
    onSuccess?.(response);
    return response;
  };
}
