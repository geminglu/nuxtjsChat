/**
 * 获取聊天列表
 */

import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async () => {
  const prisma = new PrismaClient();
  const chatList = prisma.chat.findMany();
  return chatList;
});