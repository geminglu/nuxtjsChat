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

  try {
    const prisma = new PrismaClient();
    const transaction = await prisma.$transaction(async (tx) => {
      const chatList = await tx.chat.update({
        where: { id: Number(id), uId: event.context.uId },
        data,
      });
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
