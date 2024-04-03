/**
 * 修改聊天列表信息
 */

import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const body = await readBody(event);

  const modifiableData = {
    title: body.title,
    model: body.model,
  };
  let data = {};
  for (const key in modifiableData) {
    if (body[key]) {
      data = { ...data, [key]: body[key] };
    }
  }

  const prisma = new PrismaClient();
  const chatList = prisma.chat.update({
    where: { id: Number(id) },
    data,
  });
  return chatList;
});
