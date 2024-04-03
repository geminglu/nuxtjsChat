/**
 * 获取ollama模型
 */
import { getOllama } from "../../../utils/ollama";

export default defineEventHandler(async (event) => {
  const ollama = await getOllama(event);
  return (await ollama.list()).models;
});
