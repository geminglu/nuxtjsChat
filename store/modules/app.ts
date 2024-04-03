export interface SettingsType {
  ollamaUrl?: string;
}

export const useSettings = defineStore("useSettings", {
  state: (): SettingsType => ({
    ollamaUrl: "",
  }),

  actions: {},
});

export default useSettings;
