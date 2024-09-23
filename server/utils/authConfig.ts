import config from "~/config";

const msalConfig = {
  auth: {
    clientId: config.authKey.msalConfig.clientId,
    authority: config.authKey.msalConfig.cloudInstance + config.authKey.msalConfig.tenant,
    clientSecret: config.authKey.msalConfig.clientSecret,
    redirectUrl: config.authKey.msalConfig.redirectUrl,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel: any, message: any) {
        // eslint-disable-next-line no-console
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: 3,
    },
  },
};

export default msalConfig;
