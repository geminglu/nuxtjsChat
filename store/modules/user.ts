const defaultUserInfo = {
  avatar: "",
  id: 0,
  name: "",
  createdAt: "",
  updatedAt: "",
};

export const useUserStore = defineStore("userStore", {
  state: (): { userInfo: User.UserInfo } => ({
    userInfo: defaultUserInfo,
  }),

  actions: {
    async getUserInfo() {
      const data = await useNuxtApp().$api("/api/user/userInfo");
      this.userInfo = data || defaultUserInfo;
    },
  },
});

export default useUserStore;
