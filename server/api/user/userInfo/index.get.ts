/**
 * 获取用户信息
 */
import prisma from "@/server/utils/prisma";

export default defineEventHandler(async (event) => {
  console.log(123, event.context.uId);

  return prisma.user.findUnique({ where: { id: event.context.uId } });
});
