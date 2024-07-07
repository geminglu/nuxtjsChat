export const useUserStore = defineStore("userStore", {
  state: (): { userInfo?: User.UserInfo } => ({
    userInfo: undefined,
  }),

  actions: {
    async getUserInfo() {
      const data = await useNuxtApp().$api("/api/user/userInfo");
      this.userInfo = data || undefined;
    },
  },
});

export default useUserStore;
