export const useSettings = defineStore("useSettings", {
  state: (): Settings.settings => ({
    modelaKey: {
      ollama: {
        enable: false,
        url: "http://localhost:11434",
        username: "",
        password: "",
      },
      openai: {
        enable: false,
        key: "",
        url: "",
        proxy: false,
      },
      azureOpenai: {
        enable: false,
        key: "",
        url: "",
        deploymentName: "",
        proxy: false,
      },
      anthropic: {
        enable: false,
        key: "",
        url: "",
        proxy: false,
      },
      moonshot: {
        enable: false,
        key: "",
        url: "",
      },
      gemini: {
        enable: false,
        key: "",
        url: "",
        proxy: false,
      },
      groq: {
        enable: false,
        key: "",
        url: "",
        proxy: false,
      },
    },
  }),
  persist: true,
  actions: {},
});

export default useSettings;
