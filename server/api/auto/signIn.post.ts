/**
 * 登录
 */
import prisma from "@/server/utils/prisma";
import jwt from "jsonwebtoken";
import config from "~/config";
import { setCookie } from "h3";

export default defineEventHandler(async (event) => {
  const assessToken = getCookie(event, "assessToken");
  if (!assessToken) {
    // 如果assessToken不存在就创建一个账号
    const { id } = await prisma.user.create({
      data: {
        name: "maker",
        avatar: "",
      },
    });
    const assessToken = generateToken({ id, type: "assessToken" });
    const refreshToken = generateToken({ id, type: "assessToken" });
    setCookie(event, "assessToken", `Bearer ${assessToken}`, { httpOnly: true });
    setCookie(event, "refreshToken", `Bearer ${refreshToken}`, { httpOnly: true });
  }
  return;
});

/**
 * 生成token
 */
function generateToken(payload: { [key in string]: any }) {
  return jwt.sign(payload, config.privateKey.secretKey as string, {
    expiresIn: config.privateKey.expiresIn,
  });
}

/**
 * 验证用户token
 */
export function verifyToken(token: string) {
  return jwt.verify(token.split(" ")[1], config.privateKey.secretKey as string);
}
