<template>
  <div class="flex flex-col text-sm overflow-auto grow overscroll-contain">
    <template v-if="!chatStore.chat.length">
      <div class="flex flex-col items-center mt-4 text-center text-neutral-300">
        <Icon name="ri:inbox-line" class="mb-2 text-3xl" />
        <span>没有数据</span>
      </div>
    </template>
    <template v-else>
      <ul class="flex flex-col gap-2">
        <li
          v-for="item of chatStore.chat"
          :key="item.id"
          class="flex items-center gap-3 px-3 py-3 break-all border rounded-md cursor-pointer hover:bg-neutral-100 group dark:border-neutral-800 dark:hover:bg-neutral-800"
          :class="
            isActive(item.id) && [
              'border-primary-500',
              'bg-neutral-100',
              'text-primary-500',
              'dark:bg-neutral-800',
              'dark:border-primary-400',
              'dark:text-primary-400',
            ]
          "
          @click="handleSelect(item)"
        >
          <span class="p-1">
            <Icon name="tdesign:chat-bubble-smile" />
          </span>
          <UInput
            v-if="item.isEdit"
            v-model="item.title"
            class="w-fit flex-1"
            size="2xs"
            @keypress="handleEnter(item, false, $event)"
          />
          <div v-else class="flex-1 text-ellipsis whitespace-nowrap w-fit truncate p-1">
            <span class="">{{ item.title }}</span>
          </div>
          <div v-if="isActive(item.id)" class="z-10 flex visible">
            <template v-if="item.isEdit">
              <button class="p-1" title="保存" @click="handleSave(item, $event)">
                <Icon name="tdesign:save" />
              </button>
            </template>
            <template v-else>
              <button class="p-1" title="编辑">
                <Icon name="tdesign:edit-2" @click="handleEdit(item, true, $event)" />
              </button>
              <button
                class="p-1"
                title="删除"
                @click="
                  () => {
                    isOpen = true;
                    deleteId = item.id;
                  }
                "
              >
                <Icon name="tdesign:delete-1" />
              </button>
            </template>
          </div>
        </li>
      </ul>
    </template>
    <Confirm
      v-model="isOpen"
      type="error"
      title="删除"
      description="删除后将无法恢复是否继续？"
      :confirm="onConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import useChatStore from "~/store/modules/chat";
import debounce from "~/utils/debounce";
import { Confirm } from "~/components/baseUi/modal";
import type { Options } from "ollama";
// import { UButton } from "#build/components";

const router = useRouter();

const isOpen = ref(false);
const chatStore = useChatStore();
let deleteId: number | undefined;

const chatHistory = computed(() => {
  return chatStore.chat.find((item) => item.id === chatStore.active)?.history ?? [];
});

function isActive(id: number) {
  return chatStore.active === id;
}

async function handleSelect({ id }: Chat.History) {
  if (isActive(id)) return;

  if (chatStore.active) chatStore.updateHistory(chatStore.active, { isEdit: false });
  router.replace(`/chat/${id}`);
  await chatStore.setActive(id);
}

function handleEdit({ id }: Chat.History, isEdit: boolean, event?: MouseEvent) {
  event?.stopPropagation();
  chatStore.updateHistory(id, { isEdit });
}

async function handleSave(
  chat: Partial<Pick<Chat.Chat, "model" | "title">> & Pick<Chat.Chat, "id">,
  event?: MouseEvent,
) {
  event?.stopPropagation();
  await $fetch(`/api/chat/list/${chat.id}`, {
    method: "patch",
    body: { title: chat.title },
  });
  chatStore.updateHistory(chat.id, { isEdit: false });
}

function handleEnter(chat: Chat.Chat, isEdit: boolean, event: KeyboardEvent) {
  event?.stopPropagation();
  if (event.key === "Enter") handleSave(chat);
}

const handleDeleteDebounce = debounce(handleDelete, 600);

function handleDelete(index: number, event?: MouseEvent | TouchEvent) {
  event?.stopPropagation();
  chatStore.deleteHistory(index);
  // if (isMobile.value) appStore.setSiderCollapsed(true);
}

async function onConfirm() {
  if (!deleteId) return;
  await chatStore.deleteChat(deleteId);
  if (chatStore.active === deleteId) {
    router.replace(`/chat/${deleteId}`);
  }
}
</script>
