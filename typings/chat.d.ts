declare namespace Chat {
  interface Chat {
    id: number;
    createdAt?: string;
    title: string;
    isEdit: boolean;
    model: string;
  }

  interface ChatHistory {
    startTime: string;
    endTime: string;
    text: string;
    id: number;
    role: "user" | "assistant";
    model: string;
    loading: boolean;
    error: boolean;
    chatId: number;
  }

  interface ChatState {
    active: number | null;
    usingContext: boolean;
    chat: Chat[];
    models: any[];
  }

  interface ConversationRequest {
    conversationId?: string;
    parentMessageId?: string;
  }

  interface ConversationResponse {
    conversationId: string;
    detail: {
      choices: { finish_reason: string; index: number; logprobs: any; text: string }[];
      created: number;
      id: string;
      model: string;
      object: string;
      usage: { completion_tokens: number; prompt_tokens: number; total_tokens: number };
    };
    id: string;
    parentMessageId: string;
    role: string;
    text: string;
  }
}
