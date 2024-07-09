import useSettings from "~/store/modules/app";

export default defineNuxtPlugin((nuxtApp) => {
  const settings = useSettings();
  const api = $fetch.create({
    onRequest({ options }) {
      if (!options.headers) options.headers = {};
      // @ts-ignore
      options.headers["settings"] = encodeURIComponent(JSON.stringify(settings));
    },
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
      return Promise.reject(response._data);
    },
  });

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api,
    },
  };
});
