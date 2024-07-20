<template>
  <div class="h-full">
    <slot />
  </div>
</template>

<script setup lang="ts">
import useUserStore from "~/store/modules/user";

const userStore = useUserStore();
if (import.meta.client) {
  userStore.getUserInfo();
}
</script>
