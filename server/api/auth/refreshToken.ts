/**
 * 刷新token
 */

import { setTokenCookies, verifyToken } from "./signIn.post";

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, "refreshToken");
  if (!refreshToken) return { success: false };

  try {
    const data = verifyToken(refreshToken) as { id: number; type: string };
    if (data.type !== "refreshToken") {
      return { success: false };
    }
    setTokenCookies(event, data.id);
  } catch (error) {
    return { success: false };
  }

  return { success: true };
});
