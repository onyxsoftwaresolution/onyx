import { useQuery } from '@tanstack/react-query';
import { JwtUserDTO } from '@workspace/api/src/modules/user/dtos/jwt.user.dto';
import { createContext, memo, useContext, useEffect, useState } from 'react';
import { Queries } from '../requests/queries';

type Value = {
  error?: unknown,
  isError?: boolean,
  isLoading?: boolean;
  data?: JwtUserDTO,
}

type UserContext = [
  state?: Value | undefined,
  setState?: React.Dispatch<React.SetStateAction<Value | undefined>>,
];

const userContext = createContext<UserContext>([]);

type Props = React.PropsWithChildren<unknown>;

export const Provider = memo<Props>(function Provider(props) {
  const value = useState<Value>();
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
