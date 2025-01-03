<template>
  <UModal
    v-model="isOpen"
    :overlay="!smallerThanSm"
    :transition="!smallerThanSm"
    :ui="ui"
    v-bind="attrs"
  >
    <div :class="[ui.header.base, ui.header.padding]">
      <slot name="header">
        <div :class="ui.header.inner">
          <div v-if="icon || $slots.icon" :class="ui.icon.wrapper">
            <slot name="icon">
              <Icon :name="icon as string" :class="ui.icon.base" />
            </slot>
          </div>

          <div>
            <p v-if="title || $slots.title" :class="ui.title">
              <slot name="title">
                {{ title }}
              </slot>
            </p>

            <p v-if="description || $slots.description" :class="ui.description">
              <slot name="description">
                {{ description }}
              </slot>
            </p>
          </div>
        </div>

        <UButton
          v-if="closeButton"
          aria-label="Close"
          v-bind="{ ...ui.default.closeButton, ...closeButton }"
          @click="isOpen = false"
        />
      </slot>
    </div>

    <div v-if="$slots.default" :class="[ui.body.base, ui.body.padding]">
      <slot />
    </div>

    <div v-if="$slots.footer" :class="[ui.footer.base, ui.footer.padding]">
      <slot name="footer" />
    </div>
    <div v-else :class="[ui.footer.base, ui.footer.padding]" class="flex-row-reverse">
      <UButton label="确 认" :loading="loading" @click="onConfirm" />
      <UButton color="white" label="取 消" :disabled="loading" @click="isOpen = false" />
    </div>
  </UModal>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { useBreakpoints, breakpointsTailwind } from "@vueuse/core";
import { twMerge } from "tailwind-merge";
import { modal as modalConfig } from "#ui/ui.config";
import type { Button } from "#ui/types";

const toast = useToast();

const loading = ref(false);

const config = computed(() => ({
  rounded: "sm:rounded-lg",
  shadow: "sm:shadow-xl",
  width: "sm:max-w-xl",
  height: "h-dvh sm:h-auto",
  padding: "p-0",
  header: {
    base: "flex items-start justify-between gap-x-1.5 flex-shrink-0 min-h-[--header-height]",
    inner: "flex items-start gap-4",
    padding: twMerge("px-4 py-4 sm:px-6", "pb-0"),
  },
  body: {
    base: "flex-1 flex flex-col gap-y-3 overflow-y-auto",
    padding: "px-4 py-5 sm:p-6",
  },
  footer: {
    base: "flex items-center gap-x-1.5 flex-shrink-0",
    padding: "px-4 py-4 sm:px-6",
  },
  title: "text-gray-900 dark:text-white font-semibold",
  description: "mt-1 text-gray-500 dark:text-gray-400 text-sm",
  icon: {
    wrapper: "inline-flex",
    base: "w-12 h-12 flex-shrink-0 text-gray-900 dark:text-white",
  },
  default: {
    closeButton: {
      icon: "i-heroicons-x-mark-20-solid",
      color: "gray" as const,
      variant: "ghost" as const,
      size: "sm" as const,
    },
  },
}));

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: undefined,
  },
  title: {
    type: String,
    default: undefined,
  },
  description: {
    type: String,
    default: undefined,
  },
  closeButton: {
    type: Object as PropType<Button | null>,
    default: () => ({}),
  },
  ui: {
    type: Object as PropType<Partial<typeof config.value & typeof modalConfig>>,
    default: () => ({}),
  },
  /**
   * 确定按钮事件，如果返回false或reject窗口停止关闭
   */
  confirm: {
    type: Function as PropType<() => Promise<any> | void | Boolean>,
    default: () => {},
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const breakpoints = useBreakpoints(breakpointsTailwind);
const { ui, attrs } = useUI("dashboard.modal", toRef(props, "ui"), config, undefined, true);

const smallerThanSm = breakpoints.smaller("sm");

async function onConfirm() {
  try {
    loading.value = true;
    const result = await props.confirm();
    if (result !== false) {
      isOpen.value = false;
    }
  } catch (error: any) {
    error &&
      toast.add({
        color: "red",
        title: (error.meaages || error) as string,
        icon: "i-heroicons-x-mark-20-solid",
      });
  } finally {
    loading.value = false;
  }
}
</script>
