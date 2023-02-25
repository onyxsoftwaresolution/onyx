import { UseQueryOptions } from '@tanstack/react-query';
import { Store } from '../storage/Store';
import { request } from './request';

type Options = Partial<Pick<UseQueryOptions, 'onError' | 'onSuccess'>> & {
  onLoading?: () => void;
};

export const getSelf = ({ onError, onLoading, onSuccess }: Options = {}) =>
  ({
    queryKey: ['self'],
    queryFn: async () => {
      onLoading?.();
      const token = await Store.get('access_token');
      const response = await request(`http://localhost:4000/v1/user/self`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response;
    },
    onError,
    onSuccess,
  } as UseQueryOptions);
