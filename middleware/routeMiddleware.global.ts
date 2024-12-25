export default defineNuxtRouteMiddleware(async (to) => {
  const router = useRouter();
  if (import.meta.client) {
    const isNewUSer = localStorage.getItem("isNewUSer");
    // isNewUSer不存在时表示用户时第一次访问
    if (!isNewUSer) {
      await useNuxtApp().$api("/api/auth/autoRegistration", { method: "POST", server: false });
      localStorage.setItem("isNewUSer", "true");
    }
  }
  if (to.query.assessToken) {
    delete to.query.assessToken;
    delete to.query.refreshToken;
    router.replace({ path: to.path, query: to.query });
    return;
  }
});
