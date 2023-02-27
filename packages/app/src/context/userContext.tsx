import { useQuery } from '@tanstack/react-query';
import { createContext, memo, useContext, useEffect, useState } from 'react';
import { Queries } from '../requests/Queries';

type UserState = {
  id: number;
  username: string;
  role: string;
};

type UserContext = [
  state?: unknown,
  setState?: React.Dispatch<React.SetStateAction<UserState | undefined>>,
];

const userContext = createContext<UserContext>([]);

type Props = React.PropsWithChildren<unknown>;

export const Provider = memo<Props>(function Provider(props) {
  const value = useState<unknown>();

  useQuery(
    Queries.getSelf({
      onError(error) {
        value[1]({ error, isError: true });
      },
      onLoading() {
        value[1]({ isLoading: true });
      },
      onSuccess(data) {
        value[1](data);
      },
    }),
  );

  return (
    <userContext.Provider value={value}>{props.children}</userContext.Provider>
  );
});

export const useUser = (): UserContext => {
  return useContext(userContext);
};
