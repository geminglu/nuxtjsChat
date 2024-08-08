<template>
  <div class="flex-1 flex flex-col">
    <main class="flex-1 h-full overflow-hidden">
      <div class="max-h-full overflow-hidden overflow-y-auto flex flex-col-reverse">
        <div ref="mesRef" class="w-full max-w-screen-xl m-auto" :class="[isMobile ? 'p-2' : 'p-4']">
          <template v-if="!messages.length">
            <div
              class="flex items-center justify-center mt-4 text-center text-neutral-800 dark:text-neutral-400"
            >
              <Icon name="i-tdesign-broccoli" class="text-3xl" />
              <span class="ml-2">New Chat</span>
            </div>
          </template>
          <Message
            v-for="m in messages"
            :key="m.id"
            :text="m.text"
            :start-time="m.startTime"
            :loading="m.loading"
            :inversion="m.role === 'user'"
            :error="m.error"
          />
        </div>
      </div>
    </main>
    <footer>
      <UDivider />
      <div :class="footerClass" class="w-full max-w-screen-xl m-auto">
        <div class="mb-1">
          <UDropdown
            :items="dropdownItems"
            :popper="{ placement: 'bottom-start' }"
            :ui="{ width: 'w-max' }"
          >
            <UButton class="rounded-full mb-1 mr-1" variant="outline" title="模型" size="2xs">
              <Icon name="file-icons:robots" /><span class="leading-none">{{ chat?.model }}</span>
            </UButton>
            <template #item="{ item }">
              <div class="flex w-full justify-between">
                <span class="mr-2">{{ item.label }}</span>
                <span class="text-[#9ca3af]">{{ item.size }}GB</span>
              </div>
            </template>
          </UDropdown>
        </div>
        <div class="flex items-center justify-between space-x-2">
          <UTextarea
            v-model="state.content"
            class="w-full"
            autoresize
            :maxrows="4"
            :rows="1"
            autofocus
            :disabled="loading"
            placeholder="按“回车”发送，“Shift+回车”换行"
            @keydown.enter.prevent="onEnter"
          />
          <UButton
            v-if="!loading"
            title="发送"
            icon="i-iconoir-send-diagonal-solid"
            square
            variant="solid"
            :disabled="disabledBtn"
            @click="onEnter"
          >
            发 送
          </UButton>
          <UButton
            v-else
            title="停止"
            icon="i-heroicons-stop-circle-20-solid"
            square
            variant="solid"
            @click="stop"
          >
            停 止
          </UButton>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import useChatStore from "~/store/modules/chat";
import { useBasicLayout } from "~/hooks/useBasicLayout";
import Message from "~/components/chat/Message";
import db from "~/utils/clientDB";

type ResponseMessage = { message: { role: string; content: string } };

const chatStore = useChatStore();

const dropdownItems = computed(() => {
  return [
    chatStore.models.map((item) => ({
      label: item.name,
      size: Math.round((item.size / (1024 * 1024 * 1024)) * 100) / 100,
      click: () => {
        chatStore.setChatModel(item.model);
      },
    })),
  ];
});

export interface ChatBoxFormData {
  content: string;
}

const { isMobile } = useBasicLayout();

const state = reactive<ChatBoxFormData>({
  content: "",
});
const disabled = ref(false);
const loading = ref(false);
/**
 * 聊天记录列表
 */
const messages = ref<Chat.ChatHistory[]>([]);

let controller: AbortController;

const mesRef = shallowRef<HTMLElement>();

const chat = computed(() => chatStore.getChat);
const footerClass = computed(() => {
  let classes = ["p-4"];
  if (isMobile.value)
    classes = ["sticky", "left-0", "bottom-0", "right-0", "p-2", "pr-3", "overflow-hidden"];
  return classes;
});

const disabledBtn = computed(() => {
  return disabled.value || !state.content.trim();
});

if (import.meta.client) {
  getMessage(chatStore.active as number);
}
async function onEnter(e: KeyboardEvent) {
  e.preventDefault();
  if (
    e.shiftKey &&
    e.ctrlKey &&
    e.altKey &&
    e.metaKey &&
    loading.value &&
    disabled.value &&
    !state.content.trim()
  )
    return;

  mesRef.value?.scrollIntoView({ behavior: "auto", block: "end" });

  controller = new AbortController();
  const model = chat.value?.model || "";

  loading.value = true;

  const dateTime = new Date().toISOString();
  messages.value.push(
    await addMessage({
      startTime: dateTime,
      endTime: dateTime,
      text: state.content,
      loading: false,
      role: "user",
      model,
      error: false,
      chatId: chatStore.active as number,
    }),
  );

  const body = {
    model,
    family: chatStore.models.find((f) => f.name === chat.value?.model)?.details.family,
    message: messages.value.map((i) => ({ role: i.role, content: i.text })),
    chatId: chatStore.active,
  };

  /** AI开始回复 */
  const restore = await addMessage({
    role: "assistant",
    model,
    text: "",
    startTime: dateTime,
    endTime: "",
    loading: true,
    error: false,
    chatId: chatStore.active as number,
  });
  const id = restore.id;
  messages.value.push(restore);

  state.content = "";

  try {
    const response = await useNuxtApp().$api<ReadableStream>("/api/chat", {
      method: "POST",
      body,
      signal: controller.signal,
      responseType: "stream",
    });

    const reader = response.getReader();
    // let prevPart = "";
    // const splitter = " \n\n";
    let msgContent = "";
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value, done } = await reader.read().catch((err: any) => {
        if (err.name !== "AbortError") {
          throw err;
        }
        return { done: true, value: undefined };
      });

      if (done) {
        const messageItem = messages.value.find((item) => item.id === id);
        if (messageItem) {
          // messageItem.text = msgContent;
          messageItem.endTime = new Date().toISOString();
          messageItem.loading = false;
          updataMEssage(id, messageItem);
        }
        break;
      }
      const chunk = new TextDecoder().decode(value);

      const chatMessage = JSON.parse(chunk) as ResponseMessage;
      // const isMessage = !("type" in chatMessage) && "message" in chatMessage;

      msgContent += chatMessage.message.content;
      const messageItem = messages.value.find((item) => item.id === id);
      messageItem && (messageItem.text = msgContent);
    }
  } catch (error: any) {
    const messageItem = messages.value.find((item) => item.id === id);
    if (messageItem) {
      messageItem.text = error.message;
      messageItem.endTime = new Date().toISOString();
      messageItem.loading = false;
    }

    throw Error(error.message);
  } finally {
    loading.value = false;
  }
}

function stop() {
  controller.abort();
}

async function addMessage(data: Omit<Chat.ChatHistory, "id">): Promise<Chat.ChatHistory> {
  return {
    ...data,
    id: await db.ChatHistory.add(data),
  };
}

async function updataMEssage(id: number, data: Omit<Chat.ChatHistory, "id">) {
  await db.ChatHistory.where(":id").equals(id).modify(data);
}

async function getMessage(chatId: number) {
  const res = (await db.ChatHistory.where({ chatId }).toArray()) as unknown as Chat.ChatHistory[];

  messages.value.push(...res.map((i) => ({ ...i, loading: false })));
}
</script>
