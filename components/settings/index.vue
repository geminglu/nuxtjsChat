<template>
  <div class="settings sm:h-96 min-h-full flex">
    <div class="h-full overflow-y-auto p-1 mr-4">
      <UTabs
        v-model="selected"
        :items="items"
        orientation="vertical"
        :ui="{ list: { width: 'w-40' } }"
      >
      </UTabs>
    </div>

    <div class="h-full flex-1 overflow-auto p-1">
      <UForm v-if="items[selected].key === 'account'" :state="userStore.userInfo">
        <Card>
          <CardList>
            <UFormGroup label="用户名" class="form_group">
              <UInput v-model="userStore.userInfo.name" />
            </UFormGroup>
          </CardList>
        </Card>
      </UForm>
      <UForm v-if="items[selected].key === 'model'" :state="modelaKey">
        <Card>
          <CardList>
            <UFormGroup label="Ollama" class="form_group">
              <UToggle v-model="modelaKey.ollama.enable" />
            </UFormGroup>
          </CardList>
          <template v-if="modelaKey.ollama.enable">
            <CardList>
              <UFormGroup label="Ollama Server URL" class="form_group">
                <UInput v-model="modelaKey.ollama.url" placeholder="http://localhost:11434/" />
              </UFormGroup>
            </CardList>
            <CardList>
              <UFormGroup label="user name" class="form_group">
                <UInput v-model="modelaKey.ollama.username" />
              </UFormGroup>
            </CardList>
            <CardList>
              <UFormGroup label="password" class="form_group">
                <UInput v-model="modelaKey.ollama.password" />
              </UFormGroup>
            </CardList>
          </template>
        </Card>

        <Card>
          <CardList>
            <UFormGroup label="OpenAi" class="form_group">
              <UToggle v-model="modelaKey.openai.enable" />
            </UFormGroup>
          </CardList>
          <template v-if="modelaKey.openai.enable">
            <CardList>
              <UFormGroup label="OpenAi URL" class="form_group">
                <UInput v-model="modelaKey.openai.url" />
              </UFormGroup>
            </CardList>
            <CardList>
              <UFormGroup label="OpenAi Key" class="form_group">
                <UInput v-model="modelaKey.openai.key" />
              </UFormGroup>
            </CardList>
            <!-- <CardList>
              <UFormGroup label="OpenAi Proxy" class="form_group">
                <UInput v-model="modelaKey.openai.proxy" />
              </UFormGroup>
            </CardList> -->
          </template>
        </Card>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import useSettings from "~/store/modules/app";
import useUserStore from "~/store/modules/user";
import { Card, CardList } from "~/components/baseUi/CardList/index";

defineOptions({
  name: "Settings",
});

const selected = ref(0);

const items = [
  {
    label: "账号",
    key: "account",
  },
  {
    label: "模型",
    key: "model",
  },
];

const settings = useSettings();
const userStore = useUserStore();

const modelaKey = reactive<Settings.ModelaKeyType>({
  ...JSON.parse(JSON.stringify(settings.$state.modelaKey || {})),
});

function onSubmit() {
  settings.$state.modelaKey = modelaKey;
}

defineExpose({
  submit: onSubmit,
});
</script>

<style scoped lang="less">
.settings {
  .form_group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    :last-child {
      margin-top: 0;
    }
  }
}
</style>
