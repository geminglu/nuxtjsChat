<!-- eslint-disable vue/no-v-html -->
<template>
  <div :class="wrapClass">
    <div v-if="!(!text.length && loading)" class="leading-relaxed break-words">
      <div v-if="!inversion">
        <MD v-if="!asRawText" :text="text" :loading="loading" />
        <div v-else class="" v-html="text" />
      </div>
      <MD v-else :text="text" :loading="loading" />
    </div>
    <Icon v-else class="text-2xl" name="eos-icons:three-dots-loading" />
  </div>
</template>

<script setup lang="ts">
import { useBasicLayout } from "~/hooks/useBasicLayout";

interface Props {
  inversion?: boolean;
  error?: boolean;
  text: string;
  loading?: boolean;
  asRawText?: boolean;
}

const props = defineProps<Props>();

const { isMobile } = useBasicLayout();

const wrapClass = computed(() => {
  return [
    "text-wrap",
    "min-w-[20px]",
    "rounded-md",
    isMobile.value ? "p-2" : "px-3 py-2",
    props.inversion ? "bg-primary-400" : "bg-[#f4f6f8]",
    props.inversion ? "dark:bg-primary-500" : "dark:bg-[#1e1e20]",
    props.inversion ? "message-request" : "message-reply",
    { "text-red-500": props.error },
  ];
});
</script>

<style lang="less"></style>
