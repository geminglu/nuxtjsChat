import db from "./db";

const privateKey = {
  /**
   * secretOrPrivateKey
   */
  secretKey: process.env.SECRET_KEY,
  expiresIn: process.env.EXPIRES_IN,
};

export default { db, privateKey };
