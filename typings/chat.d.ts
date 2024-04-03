declare namespace Chat {
  interface Chat {
    id: number;
    createdAt?: string;
    title: string;
    isEdit: boolean;
    model: string;
    history: History[];
  }

  interface History {
    title: string;
    isEdit: boolean;
    id: number;
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
