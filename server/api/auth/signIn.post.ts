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

export default defineEventHandler(async (event) => {
  await login(event);
});

/**
 * 登录
 */
export async function login(event: H3Event<EventHandlerRequest>) {
  const assessToken = getCookie(event, "assessToken");
  if (!assessToken) {
    // 如果assessToken不存在就创建一个账号
    const { id } = await createNewUser();
    return setTokenCookies(event, id);
  }
  return {
    assessToken: "",
    refreshToken: "",
    uId: "",
  };
}

/**
 * 生成token
 */
export function generateToken(payload: { id: number; type: "refreshToken" | "assessToken" }) {
  return jwt.sign(payload, config.privateKey.secretKey as string, {
    expiresIn: config.privateKey.expiresIn,
  });
}

/**efgertger
 * 验证用户token
 */
export function verifyToken(token: string) {
  return jwt.verify(token.split(" ")[1], config.privateKey.secretKey as string);
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
    },
  });
}

export function setTokenCookies(event: H3Event<EventHandlerRequest>, id: number) {
  const assessToken = generateToken({ id, type: "assessToken" });
  const refreshToken = generateToken({ id, type: "refreshToken" });
  // 设置cookie
  const expirationTime = new Date();
  setCookie(event, "assessToken", `Bearer ${assessToken}`, {
    httpOnly: true,
    expires: new Date(expirationTime.getTime() + 60 * 60 * 1000 * 24 * 365),
  });
  setCookie(event, "refreshToken", `Bearer ${refreshToken}`, {
    httpOnly: true,
    expires: new Date(expirationTime.getTime() + 60 * 60 * 1000 * 24 * 365),
  });
  return {
    assessToken: `Bearer ${assessToken}`,
    refreshToken: `Bearer ${refreshToken}`,
  };
}
