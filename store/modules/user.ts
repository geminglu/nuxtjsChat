export const useUserStore = defineStore("userStore", {
  state: (): { userInfo?: User.UserInfo } => ({
    userInfo: undefined,
  }),

  actions: {
    setUserInfo(userInfo: User.UserInfo) {
      this.userInfo = userInfo;
    },
  },
});

export default useUserStore;
