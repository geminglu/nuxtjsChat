import JSEncrypt from "jsencrypt";
import useUserStore from "@/store/modules/user";

/**
 * 加密
 * @param str
 * @returns
 */
export async function encrypt(str: string) {
  const userStore = useUserStore();
  const encrypt = new JSEncrypt({ default_key_size: "4096" });
  const publicKey = userStore.publicKey || (await userStore.genPublicKey());
  encrypt.setPublicKey(publicKey || "");

  return encrypt.encrypt(str);
}
