/**
 * 获取用户信息
 */
import prisma from "@/server/utils/prisma";

export default defineEventHandler(async (event) => {
  return prisma.user.findUnique({ where: { id: event.context.uId } });
});
