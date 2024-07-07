import { verifyToken } from "../api/auth/signIn.post";
import { createError } from "h3";

export default defineEventHandler(async (event) => {
  const whiteList = ["/api/auth/signIn", "/api/models/list"];

  if (event.path.includes("/api") && !whiteList.includes(event.path)) {
    const assessToken = getCookie(event, "assessToken");
    try {
      const data: any = verifyToken(assessToken || "Bearer ");
      event.context.uId = data.id;
    } catch (error: any) {
      throw createError({
        status: 401,
        statusMessage: error.message,
        message: error.message,
      });
    }
  }
});
