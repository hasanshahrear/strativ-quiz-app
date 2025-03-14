import { TUser } from "@/models";

export type TAuthContextType = {
  user: TUser | null;
  setUser: (user: TUser) => void;
  logout: () => void;
}