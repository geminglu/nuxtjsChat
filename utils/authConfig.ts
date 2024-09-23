import config from "~/config";

export const msalConfig = {
  auth: {
    clientId: config.authKey.msalConfig.clientId,
    authority: "https://login.microsoftonline.com/consumers/" + config.authKey.msalConfig.tenant,
    // redirectUri: "http://localhost:3000/login",
    // postLogoutRedirectUri: "/",
    // response_type: "code",
  },
  cache: {
    cacheLocation: "sessionStorage", // 可以选择 'localStorage' 或 'sessionStorage'
    storeAuthStateInCookie: false, // 若有兼容性问题，可设置为 true
  },
};
