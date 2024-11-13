/**
 * 自动注册
 */

import { createNewUser, setTokenCookies } from "./signIn.post";

export default defineEventHandler(async (event) => {
  const res = await createNewUser();
  const { assessToken, refreshToken } = setTokenCookies(event, res.id);
  return {
    assessToken,
    refreshToken,
    uId: res.id,
  };
});
