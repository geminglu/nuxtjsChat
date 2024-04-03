<template>
  <div class="h-full">
    <slot />
  </div>
</template>

<script setup lang="ts">
import useUserStore from "~/store/modules/user";

const userStore = useUserStore();

const cookie = useCookie("assessToken");

!cookie.value &&
  useFetch("/api/auto/signIn", {
    method: "POST",
  });

useFetch("/api/user/userInfo").then((res) => {
  res.data.value && userStore.setUserInfo(res.data.value);
});
</script>
