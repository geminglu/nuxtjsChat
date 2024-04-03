export interface SettingsType {
  ollamaUrl?: string;
}

export const useSettings = defineStore("useSettings", {
  state: (): SettingsType => ({
    ollamaUrl: "",
  }),
  persist: true,
  actions: {},
});

export default useSettings;
