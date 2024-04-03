/**
 * 修改聊天列表标题
 */

import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const { title } = await readBody(event);

  const prisma = new PrismaClient();
  const chatList = prisma.chat.update({
    where: { id: Number(id) },
    data: { title },
  });
  return chatList;
});
