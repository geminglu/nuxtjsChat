import { ConfidentialClientApplication, CryptoProvider } from "@azure/msal-node";
import msalConfig from "@/server/utils/authConfig";
import prisma from "@/server/utils/prisma";
import { createNewUser, setTokenCookies } from "../signIn.post";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const msalInstance = new ConfidentialClientApplication(msalConfig);
  const cryptoProvider = new CryptoProvider();

  const state = JSON.parse(cryptoProvider.base64Decode(query.state as string)) as any;

  const tokenResponse = await msalInstance.acquireTokenByCode(
    {
      redirectUri: msalConfig.auth.redirectUrl,
      scopes: [],
      code: query.code as string,
    },
    { code: "" },
  );

  // 查找是否有用户关联了oid，如果有就直接用这个用户进行登录，没有就注册一个新账号与oid关联
  const userInfo = await prisma.user.findUnique({
    where: { microsoftOid: tokenResponse.account?.idTokenClaims?.oid },
  });

  let assessToken = "",
    refreshToken = "";
  if (userInfo?.id) {
    const { assessToken: at, refreshToken: rt } = setTokenCookies(event, userInfo?.id);
    assessToken = at;
    refreshToken = rt;
  } else {
    const { id } = await createNewUser({
      microsoftOid: tokenResponse.account?.idTokenClaims?.oid,
      name: tokenResponse.account?.name,
    });
    const { assessToken: at, refreshToken: rt } = setTokenCookies(event, id);
    assessToken = at;
    refreshToken = rt;
  }
  event.node.res.statusCode = 302;
  event.node.res.setHeader(
    "Location",
    `${state.redirectUrl}?assessToken=${assessToken}&refreshToken=${refreshToken}`,
  );
  return;
});
