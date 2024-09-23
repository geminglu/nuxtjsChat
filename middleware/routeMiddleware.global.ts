export default defineNuxtRouteMiddleware(async (to, _from) => {
  const router = useRouter();
  if (import.meta.client) {
    const isNewUSer = useCookie("isNewUSer");

    // isNewUSer不存在时表示用户时第一次访问
    if (!isNewUSer.value) {
      await useNuxtApp().$api("/api/auth/signIn", { method: "POST", server: false });
      isNewUSer.value = "true";
    }
  }
  if (to.query.assessToken) {
    delete to.query.assessToken;
    delete to.query.refreshToken;
    router.replace({ path: to.path, query: to.query });
    return;
  }
});
