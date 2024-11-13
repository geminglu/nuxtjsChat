/**
 * 获取publicKey
 */

import config from "@/config";
export default defineEventHandler(async () => {
  return config.publicKey;
});
