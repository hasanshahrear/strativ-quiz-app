import { EUserRole } from "@/enum";

export type TUser = {
    id: number;
    username: string;
    password: string;
    role: EUserRole;
}