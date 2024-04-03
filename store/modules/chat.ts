import useSettings from "./app";

export const useChatStore = defineStore("chatStore", {
  state: (): Chat.ChatState => ({
    active: null,
    usingContext: true,
    chat: [],
    models: [],
  }),
  persist: true,
  getters: {
    getChatHistoryByCurrentActive(state: Chat.ChatState) {
      return state.chat.find((item) => item.id === state.active)?.history ?? [];
    },

    getChat(state: Chat.ChatState) {
      return state.chat.find((item) => item.id === state.active);
    },
  },

  actions: {
    /**
     * 设置当前聊天窗口的模型
     */
    async setChatModel(model: string, chatId?: string) {
      const chat = this.chat.find((item) => item.id === (chatId || this.active));
      if (chat) {
        chat.model = model;
        await $fetch(`/api/chat/list/${chat.id}`, {
          method: "patch",
          body: { model },
        });
      }
    },

    async addChat(title: string = "new chat") {
      const chat = await $fetch("/api/chat/list", {
        method: "POST",
        body: { title: title, model: this.models[0].name },
      });

      this.chat.unshift({
        ...chat,
        isEdit: false,
        history: [],
      });
      return chat;
    },

    /**
     * 获取聊天列表
     */
    async queryChat() {
      const data = await $fetch("/api/chat/list");

      const chat =
        data?.map((item) => ({
          ...item,
          history: this.chat.find((c) => c.id === item.id)?.history || [],
          isEdit: false,
        })) || [];

      this.chat = chat;
      return chat;
    },

    updateHistory(id: number, edit: Partial<Chat.History>) {
      const index = this.chat.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.chat[index] = { ...this.chat[index], ...edit };
      }
    },

    async setActive(id: number) {
      this.active = id;
    },

    async deleteHistory(index: number) {
      // this.history.splice(index, 1);
      // this.chat.splice(index, 1);
      // if (this.history.length === 0) {
      //   this.active = null;
      //   return;
      // }
      // if (index > 0 && index <= this.history.length) {
      //   const id = this.history[index - 1].id;
      //   this.active = id;
      //   return;
      // }
      // if (index === 0) {
      //   if (this.history.length > 0) {
      //     const id = this.history[0].id;
      //     this.active = id;
      //   }
      // }
      // if (index > this.history.length) {
      //   const id = this.history[this.history.length - 1].id;
      //   this.active = id;
      // }
    },

    /**
     * 删除聊天记录列表
     */
    async deleteChat(id: number) {
      this.chat = this.chat.filter((item) => item.id !== id);
      await $fetch(`/api/chat/list/${id}`, {
        method: "DELETE",
      });
      if (this.active === id && this.chat.length) {
        this.setActive(this.chat[0].id);
      }
    },

    /**
     * 获取模型
     */
    async getModels() {
      const settings = useSettings();
      const list = await $fetch("/api/models/list", {
        headers: {
          ollamaUrl: settings.ollamaUrl || "",
        },
      });
      this.models = list;
      return list;
    },
  },
});

export default useChatStore;
