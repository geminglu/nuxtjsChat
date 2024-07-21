<script setup lang="ts">
import Modal from "./Modal.vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String as PropType<"success" | "error" | "info">,
    default: "success",
  },
  title: {
    type: String,
    default: undefined,
  },
  description: {
    type: String,
    default: undefined,
  },
  /**
   * 确定按钮事件，如果返回false或reject窗口停止关闭
   */ confirm: {
    type: Function as PropType<() => Promise<any> | void | Boolean>,
    default: () => {},
  },
});

const emit = defineEmits(["update:modelValue"]);

const open = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const icons = computed(() => {
  const icons: { icon: string; color: string } = {
    icon: "i-clarity:success-standard-line",
    color: "text-red-500 dark:text-red-400",
  };
  switch (props.type) {
    case "error":
      icons.icon = "clarity:error-standard-line";
      icons.color = "text-red-500 dark:text-red-400";
      break;
    case "success":
      icons.icon = "i-clarity:success-standard-line";
      icons.color = "text-emerald-500 dark:text-emerald-400";
      break;
    case "info":
      icons.icon = "solar:info-circle-outline";
      icons.color = "text-blue-500 dark:text-blue-400";
      break;
  }
  return icons;
});
</script>

<template>
  <Modal
    v-model="open"
    :title="props.title"
    :description="props.description"
    :icon="icons.icon"
    :ui="{
      icon: { base: icons.color } as any,
    }"
    :confirm="props.confirm"
  >
  </Modal>
</template>
