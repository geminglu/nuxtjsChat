// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { H3EventContext } from "h3";

interface Context {
  keys: Settings.ModelaKeyType;
  uId: number;
}
declare module "h3" {
  interface H3EventContext extends Context {}
}
