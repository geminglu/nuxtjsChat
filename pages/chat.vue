<script setup lang="ts">
import { useBasicLayout } from "~/hooks/useBasicLayout";
import LayoutSider from "~/components/LayoutSider/index.vue";
import Sider from "~/components/chat/Sider.vue";

const { isMobile } = useBasicLayout();

const getMobileClass = computed(() => {
  if (isMobile.value) return ["rounded-none", "shadow-none"];
  return ["border", "rounded-xl", "shadow-md", "dark:border-neutral-800"];
});
</script>

<template>
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
</template>
