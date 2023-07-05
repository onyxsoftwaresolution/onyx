import { useUser } from "../../context/userContext"
import { Role } from "@workspace/api/prisma/prisma";

export const useIsAdmin = () => {
  const [user] = useUser();
  return user?.data?.role === Role.ADMIN;
}
