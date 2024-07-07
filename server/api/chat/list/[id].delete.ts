/**
 * 删除聊天列表
 */

import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  try {
    const prisma = new PrismaClient();
    const transaction = await prisma.$transaction(async (tx) => {
      const chatList = tx.chat.delete({ where: { id: Number(id), uId: event.context.uId } });
      return chatList;
    });
    return transaction;
  } catch (error) {
    return createError({
      statusCode: 403,
      message: "无权限修改",
    });
  }
});
