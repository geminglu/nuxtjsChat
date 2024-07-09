import { Ollama } from "ollama";
import type { H3Event, EventHandlerRequest } from "h3";
import { FetchWithAuth } from "../utils/index";

function createOllama(host: string, username: string | null, password: string | null) {
  return new Ollama({ host, fetch: FetchWithAuth.bind({ username, password }) });
}

export async function getOllama(event: H3Event<EventHandlerRequest>) {
  const { url, username = "", password = "" } = event.context.keys.ollama;
  return createOllama(url || "http://localhost:11434/", username, password);
}
