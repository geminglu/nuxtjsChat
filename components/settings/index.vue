<template>
  <UForm ref="form" :state="state" @submit="onSubmit">
    <UFormGroup label="Ollama Server URL" class="flex items-center justify-between">
      <UInput v-model="state.ollamaUrl" placeholder="http://localhost:11434/" />
    </UFormGroup>
    <UButton type="submit"> Submit </UButton>
  </UForm>
</template>

<script setup lang="ts">
import type { SettingsType } from "~/store/modules/app";
import useSettings from "~/store/modules/app";
import type { FormError, FormErrorEvent, FormSubmitEvent } from "#ui/types";

defineOptions({
  name: "Settings",
});

const form = ref();

const settings = useSettings();

const state = reactive<SettingsType>({
  ...settings.$state,
});

function onSubmit(event: FormSubmitEvent<SettingsType>) {
  console.log(event.data);
}

defineExpose({
  submit: onSubmit,
});
</script>
