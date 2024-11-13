/**
 * 注册账号
 */
import { z } from "zod";
import bcrypt from "bcrypt";
import { createNewUser, setTokenCookies } from "./signIn.post";

const schema = z.object({
  userName: z.string().min(2).max(10),
  password: z.string().min(6).max(18),
});

type Schema = z.output<typeof schema>;

export default defineEventHandler(async (event) => {
  const body = await readBody<Schema>(event);

  try {
    schema.parse(body);
  } catch (error: any) {
    const e = JSON.parse(error?.message || "{}")[0];
    throw createError({
      status: 400,
      statusMessage: "参数错误",
      message: `${e.path[0]} ${e.message}`,
    });
  }

  // 验证用户名是否存在
  const user = await prisma.user.findFirst({
    where: {
      name: body.userName,
    },
  });
  if (user) {
    throw createError({
      status: 400,
      statusMessage: "参数错误",
      message: "用户名已存在",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(body.password, salt);
  const res = await createNewUser({
    name: body.userName,
    password: hash,
  });
  setTokenCookies(event, res.id);

  return {
    uId: res.id,
  };
});
