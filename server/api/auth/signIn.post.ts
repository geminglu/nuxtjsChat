/**
 * 登录
 */
import prisma from "@/server/utils/prisma";
import jwt from "jsonwebtoken";
import config from "~/config";
import { setCookie } from "h3";
import fs from "fs";
import { randomNumber } from "~/utils";
import type { H3Event, EventHandlerRequest } from "h3";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import NodeRSA from "node-rsa";
import bcrypt from "bcrypt";
import dayjs from "dayjs";

const schema = z.object({
  userName: z.string().min(2).max(10),
  password: z.string().min(6).max(18),
});

type Schema = z.output<typeof schema>;

export default defineEventHandler(async (event) => {
  const body = await readBody<Schema>(event);

  const privateKey = new NodeRSA(config.privateKey || "");
  privateKey.setOptions({ encryptionScheme: "pkcs1" });

  const userName = privateKey.decrypt(body.userName).toString();
  const password = privateKey.decrypt(body.password).toString();
  const user = await prisma.user.findFirst({
    where: {
      name: userName,
    },
  });

  if (!user) {
    throw createError({
      status: 400,
      statusMessage: "登陆失败",
      message: "用户不存在",
    });
  }

  if (!(await bcrypt.compare(password, user.password || ""))) {
    throw createError({
      status: 400,
      statusMessage: "登陆失败",
      message: "账号或密码错误",
    });
  }

  setTokenCookies(event, user.id);

  return {
    uId: user.id,
  };
});

/**
 * 生成token
 */
export function generateToken(payload: { id: number; type: "refreshToken" | "assessToken" }) {
  return jwt.sign(payload, config.secretKey as string, {
    expiresIn: payload.type === "assessToken" ? config.expiresIn : config.refreshTokenExpiresIn,
  });
}

/**
 * 验证用户token
 */
export function verifyToken(token: string) {
  return jwt.verify(token.split(" ")[1], config.secretKey as string);
}

/**
 * 创建新用户
 */
export async function createNewUser(userInfo?: Partial<Prisma.UserCreateInput>) {
  const avatarDir = fs.readdirSync("server/public/images/avatar");
  return await prisma.user.create({
    data: {
      name: userInfo?.name || Math.random().toString(32).slice(6),
      avatar:
        userInfo?.avatar || `/images/avatar/${avatarDir[randomNumber(0, avatarDir.length - 1)]}`,
      microsoftOid: userInfo?.microsoftOid,
      password: userInfo?.password,
    },
  });
}

export function setTokenCookies(event: H3Event<EventHandlerRequest>, id: number) {
  const assessToken = generateToken({ id, type: "assessToken" });
  const refreshToken = generateToken({ id, type: "refreshToken" });
  // 设置cookie
  setCookie(event, "assessToken", `Bearer ${assessToken}`, {
    httpOnly: true,
    expires: new Date(dayjs().add(1, "year").format()),
  });
  setCookie(event, "refreshToken", `Bearer ${refreshToken}`, {
    httpOnly: true,
    expires: new Date(dayjs().add(1, "year").format()),
  });
  return {
    assessToken: `Bearer ${assessToken}`,
    refreshToken: `Bearer ${refreshToken}`,
  };
}
