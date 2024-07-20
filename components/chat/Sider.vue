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
          :src="userStore.userInfo?.avatar"
          :alt="userStore.userInfo?.name?.toLocaleUpperCase()"
          class="mr-2"
        />
        <span class="truncate">{{ userStore.userInfo?.name }}</span>
      </div>
      <UButton
        class="rounded-full"
        variant="ghost"
        icon="i-heroicons-cog-6-tooth"
        @click="open = !open"
      />
    </div>

    <Modal
      v-model="open"
      title="设置"
      :confirm="confirm"
      :ui="{
        width: 'lg:max-w-3xl',
      }"
    >
      <Settings ref="settingsRef" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useChatStore from "~/store/modules/chat";
import ChatList from "~/components/chat/ChatList.vue";
import Modal from "~/components/baseUi/modal/Modal.vue";
import useUserStore from "~/store/modules/user";

const open = ref(false);
const settingsRef = ref();

const userStore = useUserStore();

const chatStore = useChatStore();

async function handleAdd() {
  const chat = await chatStore.addChat();
  chatStore.setActive(chat.id);
}

function confirm() {
  settingsRef.value.submit();
}
</script>
