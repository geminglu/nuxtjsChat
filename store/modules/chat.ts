export const useChatStore = defineStore("chatStore", {
  state: (): Chat.ChatState => ({
    active: 1002,
    usingContext: true,
    history: [{ id: 1002, title: "new Chat", isEdit: false }],
    chat: [{ id: 1002, data: [] }],
  }),
  persist: true,
  getters: {
    getChatHistoryByCurrentActive(state: Chat.ChatState) {
      const index = state.history.findIndex((item) => item.id === state.active);
      if (index !== -1) return state.history[index];
      return null;
    },

    getChatByUuid(state: Chat.ChatState) {
      return (id?: number) => {
        if (id) return state.chat.find((item) => item.id === id)?.data ?? [];
        return state.chat.find((item) => item.id === state.active)?.data ?? [];
      };
    },
  },

  actions: {
    addHistory(history: Chat.History, chatData: Chat.Chat[] = []) {
      this.history.unshift(history);
      this.chat.unshift({ id: history.id, data: chatData });
      this.active = history.id;
    },

    updateHistory(id: number, edit: Partial<Chat.History>) {
      const index = this.history.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.history[index] = { ...this.history[index], ...edit };
      }
    },

    async setActive(id: number) {
      this.active = id;
    },

    async deleteHistory(index: number) {
      this.history.splice(index, 1);
      this.chat.splice(index, 1);

      if (this.history.length === 0) {
        this.active = null;
        return;
      }

      if (index > 0 && index <= this.history.length) {
        const id = this.history[index - 1].id;
        this.active = id;
        return;
      }

      if (index === 0) {
        if (this.history.length > 0) {
          const id = this.history[0].id;
          this.active = id;
        }
      }

      if (index > this.history.length) {
        const id = this.history[this.history.length - 1].id;
        this.active = id;
      }
    },
  },
});

export default useChatStore;
