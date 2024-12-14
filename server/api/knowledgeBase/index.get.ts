/**
 * 知识库列表查询
 */
import prisma from "@/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const knowledgeBases = await prisma.knowledgeBase.findMany({
    where: {
      uId: event.context.uId,
    },
  });

  return knowledgeBases || [];
});
