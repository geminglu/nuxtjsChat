export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.client) {
    const isNewUSer = useCookie("isNewUSer");

    // isNewUSer不存在时表示用户时第一次访问
    if (!isNewUSer.value) {
      await useNuxtApp().$api("/api/auth/signIn", { method: "POST", server: false });
      isNewUSer.value = "true";
    }
  }
});
