<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
        Sign in to your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <UFormGroup
          :label="$t('login.username')"
          name="username"
          size="xl"
          eager-validation
          :ui="{ wrapper: 'relative', error: 'absolute mt-1' }"
        >
          <UInput v-model="state.username" :placeholder="$t('login.placeholder_username')" />
        </UFormGroup>
        <UFormGroup
          :label="$t('login.password')"
          name="password"
          size="xl"
          eager-validation
          :ui="{ wrapper: 'relative', error: 'absolute mt-1' }"
        >
          <UInput
            v-model="state.password"
            type="password"
            :placeholder="$t('login.placeholder_password')"
          />
        </UFormGroup>
        <UFormGroup :ui="{ wrapper: 'text-end' }">
          <ULink
            aria-current-value="step"
            to=""
            active-class="text-primary"
            inactive-class="text-primary dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-500 font-semibold"
          >
            {{ $t("login.forgotten_password") }}
          </ULink>
        </UFormGroup>
        <UButton type="submit" block size="xl" :loading="loginLoading" :disabled="loginLoading">
          {{ $t("login.login") }}
        </UButton>
      </UForm>
      <UDivider label="OR" :ui="{ wrapper: { base: 'my-8' } }" />
      <div class="">
        <!-- <UButton v-bind="buttonUi" @click="handelMicrosoftSignIn">
          <icon name="logos:microsoft-icon" />
          使用 Microsoft 账号登录
        </UButton>
        <UButton v-bind="buttonUi">
          <icon name="logos:google-icon" />
          使用 Google 账号登录
        </UButton>
        <UButton v-bind="buttonUi">
          <icon name="logos:apple" />
          使用 Apple 登录
        </UButton>
        <UButton v-bind="buttonUi">
          <icon name="logos:github-icon" />
          使用 Github 登录
        </UButton> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { z } from "zod";
import useUserStore from "@/store/modules/user";

defineOptions({
  name: "SignIn",
});

const userStore = useUserStore();
const loginLoading = ref(false);

const route = useRoute();
const router = useRouter();
// const buttonUi = {
//   color: "gray",
//   size: "xl",
//   block: true,
//   ui: { base: "mb-4" },
// };

const schema = z.object({
  username: z.string().min(2, "必须在2-10个字符之间").max(10, "必须在2-10个字符之间"),
  password: z.string().min(6, "必须在6-18个字符之间").max(10, "必须在6-18个字符之间"),
});

// type Schema = z.output<typeof schema>;

const state = reactive({
  username: "",
  password: "",
});

async function onSubmit(event: { data: { username: string; password: string } }) {
  try {
    loginLoading.value = true;
    await userStore.login(event.data.username, event.data.password);
    router.replace({ path: (route.query.redirectUri as string) || "/" });
  } catch (error: any) {
    throw new Error(error);
  } finally {
    loginLoading.value = false;
  }
}

/**
 * 微软账号登录
 */
// async function handelMicrosoftSignIn() {
//   try {
//     const authCodeUrlResponse = await useNuxtApp().$api("/api/auth/microsoft/signin", {
//       params: { redirectUrl: route.query.redirectUri || location.origin },
//     });

//     location.replace(authCodeUrlResponse);
//   } catch (error: any) {
//     sessionStorage.removeItem("msal.interaction.status");
//     throw new Error(error);
//   }
// }
</script>

<style></style>
