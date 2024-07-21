declare namespace Settings {
  interface ModelaKeyType {
    ollama: {
      enable: boolean;
      url: string;
      username?: string;
      password?: string;
    };
    openai: {
      enable: boolean;
      key: string;
      url: string;
      proxy: boolean;
    };
    azureOpenai: {
      enable: boolean;
      key: string;
      url: string;
      deploymentName: string;
      proxy: boolean;
    };
    anthropic: {
      enable: boolean;
      key: string;
      url: string;
      proxy: boolean;
    };
    moonshot: {
      enable: boolean;
      key: string;
      url: string;
    };
    gemini: {
      enable: boolean;
      key: string;
      url: string;
      proxy: boolean;
    };
    groq: {
      enable: boolean;
      key: string;
      url: string;
      proxy: boolean;
    };
    /** custom model base on OpenAI API */
    // custom: Array<{
    //   name: string;
    //   aiType: Exclude<keyof ModelaKeyType, "custom" | "moonshot" | "ollama">;
    //   key: string;
    //   url: string;
    //   proxy: boolean;
    //   models: string[];
    // }>;
  }
  interface settings {
    modelaKey: ModelaKeyType;
  }
}
