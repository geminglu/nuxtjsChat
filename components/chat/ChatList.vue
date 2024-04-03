<template>
  <div class="flex flex-col text-sm overflow-auto gap-2 grow overscroll-contain">
    <template v-if="!chatStore.history.length">
      <div class="flex flex-col items-center mt-4 text-center text-neutral-300">
        <Icon name="ri:inbox-line" class="mb-2 text-3xl" />
        <span>没有数据</span>
      </div>
    </template>
    <template v-else>
      <div v-for="item of chatStore.history" :key="item.id">
        <a
          class="relative flex items-center gap-3 px-3 py-3 break-all border rounded-md cursor-pointer hover:bg-neutral-100 group dark:border-neutral-800 dark:hover:bg-neutral-800 pr-16"
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
          <span>
            <Icon name="tdesign:chat-bubble-smile" />
          </span>
          <div class="relative flex-1 break-all text-ellipsis whitespace-nowrap w-fit">
            <UInput
              v-if="item.isEdit"
              v-model="item.title"
              size="2xs"
              @keypress="handleEnter(item, false, $event)"
            />
            <span v-else class="truncate">{{ item.title }}</span>
          </div>
          <div v-if="isActive(item.id)" class="absolute z-10 flex visible right-1">
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
        </a>
      </div>
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
import useChatStore from "~/store/modules/chat";
import debounce from "~/utils/debounce";
import { Confirm } from "~/components/baseUi/modal";
// import { UButton } from "#build/components";

const isOpen = ref(false);
const chatStore = useChatStore();
let deleteId: number | undefined;

async function refreshHistory() {
  const data = await $fetch("/api/chat/list");

  chatStore.history = data?.map((item: any) => ({ ...item, isEdit: false })) || [];
}
refreshHistory();

function isActive(id: number) {
  return chatStore.active === id;
}

async function handleSelect({ id }: Chat.History) {
  if (isActive(id)) return;

  if (chatStore.active) chatStore.updateHistory(chatStore.active, { isEdit: false });
  await chatStore.setActive(id);
}

function handleEdit({ id }: Chat.History, isEdit: boolean, event?: MouseEvent) {
  event?.stopPropagation();
  chatStore.updateHistory(id, { isEdit });
}

async function handleSave(history: Chat.History, event?: MouseEvent) {
  event?.stopPropagation();
  await $fetch(`/api/chat/list/${history.id}`, {
    method: "PUT",
    body: history,
  });
  chatStore.updateHistory(history.id, { isEdit: false });
}

function handleEnter(history: Chat.History, isEdit: boolean, event: KeyboardEvent) {
  event?.stopPropagation();
  if (event.key === "Enter") handleSave(history);
}

const handleDeleteDebounce = debounce(handleDelete, 600);

function handleDelete(index: number, event?: MouseEvent | TouchEvent) {
  event?.stopPropagation();
  chatStore.deleteHistory(index);
  // if (isMobile.value) appStore.setSiderCollapsed(true);
}

async function onConfirm() {
  await $fetch(`/api/chat/list/${deleteId}`, {
    method: "DELETE",
  });
  refreshHistory();
}
</script>
