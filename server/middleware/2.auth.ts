import { verifyToken } from "../api/auth/signIn.post";
import { createError } from "h3";

export default defineEventHandler(async (event) => {
  const whiteList = [
    "/api/auth/signIn",
    "/api/models/list",
    "/api/auth/microsoft/signin",
    "/api/auth/microsoft/redirect",
    "/api/auth/refreshToken",
    "/api/auth/register",
    "/api/auth/getPublicKey",
    "/api/auth/autoRegistration",
  ];

  const uri = getRequestURL(event);

  if (
    uri.pathname.includes("/api") &&
    !whiteList.includes(uri.pathname) &&
    !event.path.includes("/api/content")
  ) {
    const assessToken = getCookie(event, "assessToken");
    try {
      const data: any = verifyToken(assessToken || "Bearer ");
      event.context.uId = data.id;
      const user = await prisma.user.findUnique({ where: { id: event.context.uId } });
      if (!user) {
        throw createError({
          status: 401,
          statusMessage: "用户未登录",
          message: "用户未登录",
        });
      }
      event.context.userInfo = user;
    } catch (error: any) {
      throw createError({
        status: 401,
        statusMessage: error.message,
        message: error.message,
      });
    }
  }
});
