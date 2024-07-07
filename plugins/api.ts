export default defineNuxtPlugin((nuxtApp) => {
  const api = $fetch.create({
    onRequest() {},
    async onResponseError({ response }) {
      const toast = useToast();
      toast.add({
        color: "red",
        title: `${response.status} ${response.statusText}`,
        description: response._data.message,
        icon: "i-heroicons-x-mark-20-solid",
      });
      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo("/login"));
      }
    },
  });

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api,
    },
  };
});
