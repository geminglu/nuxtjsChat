import Dexie from "dexie";
import type { EntityTable } from "dexie";

export class MySubClassedDexie extends Dexie {
  ChatHistory!: EntityTable<Omit<Chat.ChatHistory, "id">>;
  Chat!: EntityTable<Chat.Chat>;

  constructor() {
    super("chat");
    this.version(3).stores({
      ChatHistory: "++id, chatId",
      Chat: "++id",
    });
  }
}

export default new MySubClassedDexie();
