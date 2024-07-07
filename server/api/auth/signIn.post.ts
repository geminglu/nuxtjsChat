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
    const avatarDir = fs.readdirSync("server/public/images/avatar");
    const { id } = await prisma.user.create({
      data: {
        name: "maker",
        avatar: `/images/avatar/${avatarDir[randomNumber(0, avatarDir.length - 1)]}`,
      },
    });
    const assessToken = generateToken({ id, type: "assessToken" });
    const refreshToken = generateToken({ id, type: "assessToken" });
    setCookie(event, "assessToken", `Bearer ${assessToken}`, { httpOnly: true });
    setCookie(event, "refreshToken", `Bearer ${refreshToken}`, { httpOnly: true });
    return {
      assessToken: `Bearer ${assessToken}`,
      refreshToken: `Bearer ${refreshToken}`,
      uId: id,
    };
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
function generateToken(payload: { [key in string]: any }) {
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
