<script setup lang="ts">
import { useBasicLayout } from "~/hooks/useBasicLayout";
import LayoutSider from "~/components/LayoutSider/index.vue";
import Sider from "~/components/chat/Sider.vue";
import useChatStore from "~/store/modules/chat";

const route = useRoute();

const { isMobile } = useBasicLayout();

const getMobileClass = computed(() => {
  if (isMobile.value) return ["rounded-none", "shadow-none"];
  return ["border", "rounded-xl", "shadow-md", "dark:border-neutral-800"];
});

const chatStore = useChatStore();

async function init() {
  await chatStore.getModels();

  chatStore.queryChat().then(async (chat) => {
    // 如果聊天列表中没有记录就需要创建一个
    if (!chat.length) {
      const chat = await chatStore.addChat();
      chatStore.setActive(chat.id);
      // router.replace(`/chat/${chat.id}`);
      return;
    }
    if (chat.length && !route.params.id) {
      chatStore.setActive(chat[0].id);
      // router.replace(`/chat/${chat[0].id}`);
      return;
    }
    if (chat.length && route.params.id) {
      if (chat.find((item) => item.id === +route.params.id)) {
        chatStore.setActive(+route.params.id);
        // router.replace(`/chat/${route.params.id}`);
        return;
      } else {
        chatStore.setActive(chat[0].id);
        // router.replace(`/chat/${chat[0].id}`);
      }
    }
  });
}
if (import.meta.client) {
  init();
}
</script>

<template>
  <NuxtLayout>
    <div class="h-full dark:bg-[#24272e] transition-all" :class="[isMobile ? 'p-0' : 'p-8']">
      <div
        class="h-full overflow-hidden transition-all flex dark:bg-zinc-950"
        :class="getMobileClass"
      >
        <LayoutSider
          :width="300"
          :resizable="{ min: 200, max: 300 }"
          collapsible
          class="dark:bg-zinc-900"
        >
          <Sider />
        </LayoutSider>
        <NuxtPage />
      </div>
    </div>
  </NuxtLayout>
</template>
