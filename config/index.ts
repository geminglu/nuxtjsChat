import db from "./db";

const privateKey = {
  /**
   * secretOrPrivateKey
   */
  secretKey: process.env.SECRET_KEY,
  expiresIn: process.env.EXPIRES_IN,
};

export const config = {
  /**
   * 开发环境端口
   */
  port: Number(process.env.port) || 3000,
};

export default {
  db,
  privateKey,
  ...config,
};
