interface userStoreType {
  userInfo: User.UserInfo;
  publicKey: string;
}

const defaultUserInfo = {
  avatar: "",
  id: 0,
  name: "",
  createdAt: "",
  updatedAt: "",
};

export const useUserStore = defineStore("userStore", {
  state: (): userStoreType => ({
    userInfo: defaultUserInfo,
    publicKey: "",
  }),

  actions: {
    async getUserInfo() {
      const data = await useNuxtApp().$api("/api/user/userInfo");
      this.userInfo = data || defaultUserInfo;
    },

    /**
     * 登陆
     */
    async login(userName: string, password: string) {
      const encryptPassword = await useNuxtApp().$RSAEncrypt(password);
      const encryptUserName = await useNuxtApp().$RSAEncrypt(userName);
      await useNuxtApp().$api("/api/auth/signIn", {
        method: "POST",
        body: {
          userName: encryptUserName,
          password: encryptPassword,
        },
      });
    },

    /**
     * 获取公钥
     */
    async genPublicKey() {
      const publicKey = await useNuxtApp().$api("/api/auth/getPublicKey");
      this.publicKey = publicKey || "";
      return publicKey;
    },
  },
});

export default useUserStore;
