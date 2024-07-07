export interface SettingsType {
  ollamaUrl?: string;
}

export const useSettings = defineStore("useSettings", {
  state: (): SettingsType => ({
    ollamaUrl: "" || "http://localhost:11434",
  }),
  persist: true,
  actions: {},
});

export default useSettings;
