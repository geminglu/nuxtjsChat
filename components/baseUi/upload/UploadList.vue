<template>
  <transition-group tag="ul" class="mt-3">
    <li
      v-for="(file, index) in files"
      :key="file.uid || file.name"
      class="text-sm leading-8 mb-1 rounded w-full relative text-current flex items-center transition hover:text-primary hover:dark:bg-primary-950 hover:bg-primary-100 fileList"
      tabindex="0"
      @keydown.delete="!disabled && handleRemove(file)"
      @focus="focusing = true"
      @blur="focusing = false"
      @click="focusing = false"
    >
      <slot :file="file" :index="index">
        <template v-if="listType === 'picture'">
          <div class="h-20 w-full flex items-center justify-between rounded border">
            <div
              class="h-full p-2 flex items-center mr-2 cursor-pointer flex-1"
              @click.prevent="handlePreview(file)"
            >
              <img
                v-if="file.raw?.type.toLocaleLowerCase().includes('image')"
                class="h-full"
                :src="file.url"
                :crossorigin="crossorigin"
                :alt="file.name"
              />
              <template v-else>
                <img class="h-full" :src="extendFile(file).icon" :alt="file.name" />
              </template>
              <span class="ml-2">
                {{ file.name }}
              </span>
            </div>
            <div
              v-if="!disabled"
              class="hover:text-rose-500 cursor-pointer mr-2 transition"
              @click="handleRemove(file)"
            >
              <Icon name="iconoir:trash" />
            </div>
          </div>
        </template>
        <!-- <template v-else-if="listType === 'picture-card'">
          <div class="">
            <img
              v-if="file.raw?.type.toLocaleLowerCase().includes('image')"
              class="h-full"
              :src="file.url"
              :crossorigin="crossorigin"
              :alt="file.name"
            />
            <template v-else>
              <img class="h-full" :src="extendFile(file).icon" :alt="file.name" />
            </template>
            <div>{{ extendFile(file).icon }}</div>
            <span>
              <span @click="handlePreview(file)">
                <Icon name="heroicons:magnifying-glass-plus" />
              </span>
              <span v-if="!disabled" @click="handleRemove(file)">
                <Icon name="iconoir:trash" />
              </span>
            </span>
            <span class="ml-2">
              {{ file.name }}
            </span>
          </div>
        </template> -->
        <template v-else>
          <div
            class="inline-flex justify-center flex-col ml-1 flex-1 cursor-pointer font-medium transition"
          >
            <span @click.prevent="handlePreview(file)">
              <Icon name="heroicons:document-text" class="mr-1" />
              <span :title="file.name" class="align-middle">
                {{ file.name }}
              </span>
            </span>
            <div v-if="file.status === 'uploading'" class="flex items-center">
              <UProgress size="sm" :value="Number(file.percentage) || 0" />
              <span class="leading-none ml-3">
                {{ Math.floor(file.percentage || 0) + "%" }}
              </span>
            </div>
          </div>

          <label class="block absolute right-2 check">
            <Icon v-if="listType === 'text'" name="heroicons:check-circle" class="text-lime-500" />
            <Icon
              v-else-if="['picture-card', 'picture'].includes(listType)"
              name="heroicons:check-16-solid"
            />
          </label>
          <label
            :title="$t('common.delete')"
            class="hidden absolute right-2 hover:text-rose-500 cursor-pointer transition remove"
            @click="handleRemove(file)"
          >
            <Icon v-if="!disabled" name="heroicons:x-mark-20-solid" />
          </label>
        </template>
      </slot>
    </li>
    <slot name="append" />
  </transition-group>
</template>

<script lang="ts" setup>
import type { uploadListProps, UploadFile } from "./type";
import { extendFile } from "~/utils";

withDefaults(defineProps<uploadListProps>(), {
  files: () => [],
  disabled: false,
  listType: "text",
});

const emit = defineEmits({
  remove: (file: UploadFile) => !!file,
});

const focusing = ref(false);

const handleRemove = (file: UploadFile) => {
  emit("remove", file);
};
</script>

<style scoped>
.fileList:hover .remove {
  display: block;
}
.fileList:hover .check {
  display: none;
}
</style>
