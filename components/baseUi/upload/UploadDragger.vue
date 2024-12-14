<template>
  <div @drop.prevent="onDrop" @dragover.prevent="onDragover" @dragleave.prevent="dragover = false">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { inject, ref } from "vue";
import type { uploadDraggerProps } from "./type";
// eslint-disable-next-line vue/prefer-import-from-vue
import { isArray } from "@vue/shared";
import { uploadContextKey } from "./constants";

defineOptions({
  name: "UploadDragger",
});

const props = withDefaults(defineProps<uploadDraggerProps>(), {
  disabled: false,
});

const emit = defineEmits({ file: (file: File[]) => isArray(file) });

const uploaderContext = inject(uploadContextKey);
if (!uploaderContext) {
  // throwError(COMPONENT_NAME, "usage: <el-upload><el-upload-dragger /></el-upload>");
}

const dragover = ref(false);
// const disabled = useFormDisabled();
const disabled = computed(() => {
  return props.disabled;
});

const onDrop = (e: DragEvent) => {
  if (disabled.value) return;
  dragover.value = false;

  e.stopPropagation();

  const files = Array.from(e.dataTransfer!.files);
  emit("file", files);
};

const onDragover = () => {
  if (!disabled.value) dragover.value = true;
};
</script>
