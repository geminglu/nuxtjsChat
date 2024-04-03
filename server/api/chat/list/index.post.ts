/**
 * 添加聊天列表
 */

import { PrismaClient } from "@prisma/client";
import ollama from "ollama";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const prisma = new PrismaClient();
  if (!body.model) {
    body.model = (await ollama.list()).models[0].name;
  }

  const chat = prisma.chat.create({
    data: { title: body.title, model: body.model, uId: event.context.uId },
  });

  return chat;
});
