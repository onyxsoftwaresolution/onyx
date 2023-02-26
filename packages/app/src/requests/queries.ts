import { UseQueryOptions } from '@tanstack/react-query';
import { Store } from '../storage/Store';
import { queryFn, request } from './request';

type Options = Partial<Pick<UseQueryOptions, 'onError' | 'onSuccess'>> & {
  onLoading?: () => void;
};

export const getSelf = ({ onError, onLoading, onSuccess }: Options = {}) =>
  ({
    queryKey: ['self'],
    queryFn: async () => {
      onLoading?.();
      return await queryFn(`http://localhost:4000/v1/user/self`);
    },
    onError,
    onSuccess,
  } as UseQueryOptions);

export const getEmployees = ({ onError, onLoading, onSuccess }: Options = {}) =>
  ({
    queryKey: ['employees'],
    queryFn: async () => {
      onLoading?.();
      return await queryFn(`http://localhost:4000/v1/employees`);
    },
    onError,
    onSuccess,
  } as UseQueryOptions);
