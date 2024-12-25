import useSettings from "~/store/modules/app";

export default defineNuxtPlugin((nuxtApp) => {
  const settings = useSettings();
  let refreshTokenPromise: Promise<any> | null = null;

  function handleTokenRefresh(api: ReturnType<typeof $fetch.create>) {
    if (!refreshTokenPromise) {
      refreshTokenPromise = api("/api/auth/refreshToken")
        .then((result) => {
          if (!result.success) {
            throw new Error("Failed to refresh token");
          }
          return result;
        })
        .finally(() => {
          refreshTokenPromise = null; // 重置状态
        });
    }

    return refreshTokenPromise;
  }

  const api = $fetch.create({
    onRequest({ options }) {
      const headers = new Headers(options.headers);
      headers.set("settings", encodeURIComponent(JSON.stringify(settings.$state)));
      options.headers = headers;
    },

    async onResponseError({ options, response }) {
      const route = useRoute();
      let data;
      if (response._data instanceof ReadableStream) {
        const reader = response._data.getReader();
        const decoder = new TextDecoder("utf-8");
        let chunk = "";
         
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

      if (response.status === 401) {
        try {
          await handleTokenRefresh(api);
          // 如果刷新成功，重新发起原始请求
          options.retryStatusCodes = [401];
          options.retryDelay = 0;
          options.retry = 1;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          await nuxtApp.runWithContext(() =>
            navigateTo(`/login/?redirectUri=${route.fullPath}`, { replace: true }),
          );
        }
      } else {
        const toast = useToast();
        toast.add({
          color: "red",
          title: `${response.status} ${response.statusText}`,
          description: data.message,
          icon: "i-heroicons-x-mark-20-solid",
        });
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
