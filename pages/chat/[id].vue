<template>
  <div class="flex-1 flex flex-col">
    <main class="flex-1 h-full overflow-hidden">
      <div id="scrollRef" ref="scrollRef" class="h-full overflow-hidden overflow-y-auto">
        <div
          id="image-wrapper"
          class="w-full max-w-screen-xl m-auto"
          :class="[isMobile ? 'p-2' : 'p-4']"
        >
          <template v-if="!dataSources.length">
            <div
              class="flex items-center justify-center mt-4 text-center text-neutral-800 dark:text-neutral-400"
            >
              <Icon name="i-tdesign-broccoli" class="text-3xl" />
              <span class="ml-2">New Chat</span>
            </div>
          </template>
        </div>
      </div>
    </main>
    <footer>
      <UDivider />
      <div :class="footerClass" class="w-full max-w-screen-xl m-auto">
        <div class="mb-1">
          <UDropdown :items="dropdownItems" :popper="{ placement: 'bottom-start' }">
            <UButton class="rounded-full mb-1 mr-1" variant="outline" title="模型" size="2xs">
              <Icon name="file-icons:robots" /><span class="leading-none">{{ chat?.model }}</span>
            </UButton>
            <template #item="{ item }">
              <div class="flex w-full justify-between">
                <span>{{ item.label }}</span>
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
            :loading="loading"
            loading-icon="i-iconoir-lens"
            icon="i-iconoir-send-diagonal-solid"
            square
            variant="solid"
            :disabled="disabledBtn"
            @click="onEnter"
          >
            发 送
          </UButton>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import useChatStore from "~/store/modules/chat";
import { useBasicLayout } from "~/hooks/useBasicLayout";
import useSettings from "~/store/modules/app";

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

const settings = useSettings();

const state = reactive<ChatBoxFormData>({
  content: "",
});
const disabled = ref(false);
const loading = ref(false);
/**
 * 聊天记录列表
 */
const messages = ref<any[]>([]);

const dataSources = computed(() => chatStore.getChatHistoryByCurrentActive);
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

  const body = {
    model: chat.value?.model,
    content: state.content,
    chatId: chatStore.active,
  };
  try {
    loading.value = true;
    await $fetch("/api/chat", {
      method: "POST",
      body,
      headers: {
        ollamaUrl: settings.ollamaUrl || "",
      },
    });
  } catch (error) {
    //
  } finally {
    loading.value = false;
  }
}

// const fetchStream = async (url: string | URL | Request, options: any) => {
//   const response = await $fetch(url, options);

//   if (response.body) {
//     const reader = response.body.getReader();
//     // eslint-disable-next-line no-constant-condition
//     while (true) {
//       const { done, value } = await reader.read();
//       if (done) break;

//       const chunk = new TextDecoder().decode(value);
//       chunk.split("\n\n").forEach(async (line) => {
//         if (line) {
//           console.log("line: ", line);
//           const chatMessage = JSON.parse(line);
//           const content = chatMessage?.message?.content;
//           if (content) {
//             if (
//               messages.value.length > 0 &&
//               messages.value[messages.value.length - 1].role === "assistant"
//             ) {
//               messages.value[messages.value.length - 1].content += content;
//             } else {
//               messages.value.push({ role: "assistant", content });
//             }
//           }
//         }
//       });
//     }
//   } else {
//     console.log("The browser doesn't support streaming responses.");
//   }
// };
</script>
