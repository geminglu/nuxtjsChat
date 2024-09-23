import { CryptoProvider, ConfidentialClientApplication } from "@azure/msal-node";
import msalConfig from "@/server/utils/authConfig";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const cryptoProvider = new CryptoProvider();
  const state = cryptoProvider.base64Encode(JSON.stringify({ ...query }));

  const msalInstance = new ConfidentialClientApplication(msalConfig);
  const authCodeUrlResponse = await msalInstance.getAuthCodeUrl({
    redirectUri: msalConfig.auth.redirectUrl,
    scopes: [],
    state,
  });
  // 返回重定向地址
  return authCodeUrlResponse;
});
