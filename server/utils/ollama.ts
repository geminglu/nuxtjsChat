import { Ollama } from "ollama";
import type { H3Event, EventHandlerRequest } from "h3";
import { FetchWithAuth } from "../utils/index";

function createOllama(host: string, username: string | null, password: string | null) {
  console.log(1231231, host);

  return new Ollama({ host, fetch: FetchWithAuth.bind({ username, password }) });
}

export async function getOllama(event: H3Event<EventHandlerRequest>) {
  const { ollamaurl } = getHeaders(event);
  const username = "";
  const password = "";
  return createOllama(ollamaurl || "http://localhost:11434/", username, password);
}
