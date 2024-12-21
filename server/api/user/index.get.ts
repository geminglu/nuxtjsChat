/**
 * 获取所有用户
 */
import prisma from "@/server/utils/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().max(30).optional(),
  id: z.number().optional(),
  page: z.string().regex(/^[0-9]+$/),
  pageSize: z.string().regex(/^[0-9]+$/),
});

type Schema = z.output<typeof schema>;

export default defineEventHandler(async (event) => {
  const query = getQuery<Schema>(event);

  try {
    schema.parse(query);
  } catch (error: any) {
    const e = JSON.parse(error?.message || "{}")[0];
    throw createError({
      status: 400,
      statusMessage: "参数错误",
      message: `${e.path[0]} ${e.message}`,
    });
  }

  const where = {
    name: {
      contains: query.name,
    },
  };
  const data = await prisma.user.findMany({
    where,
    select: { name: true, id: true, avatar: true, createdAt: true },
    skip: ((Number(query.page) || 1) - 1) * Number(query.pageSize),
    take: Number(query.pageSize),
  });
  const total = await prisma.user.count({
    where,
  });
  return { list: data, total };
});
