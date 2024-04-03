<template>
  <div class="p-4 h-full flex flex-col">
    <div class="mb-4 w-full">
      <UButton
        class="border-dashed border hover:border-primary-500"
        block
        icon="i-heroicons-pencil-square"
        size="sm"
        variant="ghost"
        @click="handleAdd"
      >
        新建聊天
      </UButton>
    </div>
    <ChatList />

    <div class="flex items-center mt-4">
      <div class="flex items-center flex-1 truncate">
        <UAvatar
          src="https://avatars.githubusercontent.com/u/739984?v=4"
          alt="Avataree"
          class="mr-2"
        />
        <span class="truncate">zhangsanb</span>
      </div>
      <UButton class="rounded-full" variant="ghost" icon="i-heroicons-cog-6-tooth" />
    </div>
  </div>
</template>

<script setup lang="ts">
import useChatStore from "~/store/modules/chat";
import ChatList from "~/components/chat/ChatList.vue";

const chatStore = useChatStore();

async function handleAdd() {
  const char = await $fetch("/api/chat/list", {
    method: "POST",
    body: { title: "new chat" },
  });

  chatStore.addHistory({ ...char, isEdit: false });
}
</script>
