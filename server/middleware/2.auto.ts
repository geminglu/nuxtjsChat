import { verifyToken } from "../api/auto/signIn.post";

export default defineEventHandler((event) => {
  const whiteList = ["/api/auto/signIn"];
  console.log(event.path, event.path.includes("/api") && !whiteList.includes(event.path));

  if (event.path.includes("/api") && !whiteList.includes(event.path)) {
    const assessToken = getCookie(event, "assessToken");
    try {
      const data: any = verifyToken(assessToken as string);
      event.context.uId = data.id;
    } catch (error: any) {
      setResponseStatus(event, 401, error.message);
      return;
    }
  }
});
