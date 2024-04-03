/**
 * 添加聊天列表
 */

import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const prisma = new PrismaClient();
  const chat = prisma.chat.create({
    data: body,
  });

  return chat;
});
