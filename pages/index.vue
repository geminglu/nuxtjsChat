<template>
  <div></div>
</template>

<script setup lang="ts">
import useUserStore from "~/store/modules/user";

const userStore = useUserStore();

useFetch("/api/auto/signIn", {
  method: "POST",
});

useFetch("/api/user/userInfo").then((res) => {
  res.data.value && userStore.setUserInfo(res.data.value);
});
</script>
