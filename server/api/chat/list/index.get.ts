/**
 * 获取用户自己的聊天列表
 */

import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();
  const chatList = prisma.chat.findMany({
    where: {
      uId: event.context.uId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return chatList;
});
