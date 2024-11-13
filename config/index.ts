import db from "./db";
import authKey from "./authKey";

export const config = {
  /**
   * 开发环境端口
   */
  port: Number(process.env.port) || 3000,

  /**
   * 上传文件路径
   */
  uploadFilePath: process.env.UPLOAD_FILE_PATH || "./uploads",
  publicKey: process.env.PUBLIC_KEY,
  secretKey: process.env.SECRET_KEY,
  /** assessToken过期时间 */
  expiresIn: process.env.EXPIRES_IN || "1h",
  /** refreshToken过期时间 */
  refreshTokenExpiresIn: process.env.REFRESHTOKEN_EXPIRES_IN || "7d",
  privateKey: process.env.PRIVATE_KEY,
};

export default {
  db,
  authKey,
  ...config,
};
