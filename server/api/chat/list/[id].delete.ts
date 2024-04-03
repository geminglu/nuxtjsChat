/**
 * 删除聊天列表
 */

import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  const prisma = new PrismaClient();
  const chatList = prisma.chat.delete({ where: { id: Number(id) } });
  return chatList;
});
