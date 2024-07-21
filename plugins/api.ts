import useSettings from "~/store/modules/app";

export default defineNuxtPlugin((nuxtApp) => {
  const settings = useSettings();
  const api = $fetch.create({
    onRequest({ options }) {
      if (!options.headers) options.headers = {};
      // @ts-ignore
      options.headers["settings"] = encodeURIComponent(JSON.stringify(settings.$state));
    },
    async onResponseError({ response }) {
      let data;
      if (response._data instanceof ReadableStream) {
        const reader = response._data.getReader();
        const decoder = new TextDecoder("utf-8");
        let chunk = "";
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            data = JSON.parse(chunk);
            break;
          }
          chunk += decoder.decode(value);
        }
        response._data = data;
      } else {
        data = response._data;
      }

      const toast = useToast();
      toast.add({
        color: "red",
        title: `${response.status} ${response.statusText}`,
        description: data.message,
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
