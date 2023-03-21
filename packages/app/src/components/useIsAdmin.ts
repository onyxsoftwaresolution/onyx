import { useUser } from "../context/userContext"
import { Role } from "@workspace/api/node_modules/@prisma/client";

export const useIsAdmin = () => {
  const [user] = useUser();
  return user?.data?.role === Role.ADMIN;
}
