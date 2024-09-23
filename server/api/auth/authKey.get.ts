import config from "~/config";
import { stringToBase64 } from "~/utils";

export default defineEventHandler(async () => {
  return stringToBase64(JSON.stringify(config.authKey));
});
