// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { H3EventContext } from "h3";
import type { User } from "@prisma/client";

interface Context {
  keys: Settings.ModelaKeyType;
  uId?: number;
  userInfo: User;
}
declare module "h3" {
  interface H3EventContext extends Context {}
}
