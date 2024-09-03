/**
 * 获取用户信息
 */
import prisma from "@/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const data = await prisma.user.findUnique({ where: { id: event.context.uId } });
  if (!data) {
    throw createError({
      status: 401,
      statusMessage: "用户不存在",
      message: "用户不存在",
    });
  }

  return data;
});
