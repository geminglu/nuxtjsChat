/**
 * 获取用户信息
 */
import prisma from "@/server/utils/prisma";

export default defineEventHandler(async (event) => {
  if (event.context.uId) {
    return await prisma.user.findUnique({
      where: {
        id: event.context.uId,
      },
    });
  } else {
    throw createError({
      status: 401,
      statusMessage: "用户未登录",
      message: "用户未登录",
    });
  }
});
