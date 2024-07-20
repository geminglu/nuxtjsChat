<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    class="markdown-body break-words break-all"
    :class="{ 'markdown-body-generate': loading }"
    v-html="text"
  ></div>
</template>

<script setup lang="ts">
import markdown from "./markdownIt";

interface Props {
  text: string;
  loading?: boolean;
}

const props = defineProps<Props>();
const md = markdown();

const text = computed(() => {
  return md.render(props.text) || "&nbsp;";
});
</script>
