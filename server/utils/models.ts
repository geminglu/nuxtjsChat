import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { type H3Event } from "h3";

/**
 *
 * @param modelName 模型名称
 * @param family
 * @param event
 */
export const createChatModel = (modelName: string, event: H3Event): BaseChatModel => {
  const keys = event.context.keys;
  return new ChatOllama({
    baseUrl: keys.ollama.url,
    model: modelName,
  });
};
