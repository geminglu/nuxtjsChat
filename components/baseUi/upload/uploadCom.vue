<template>
  <div class="">
    <UploadList
      v-if="isPictureCard && showFileList"
      :disabled="disabled"
      :list-type="listType"
      :files="uploadFiles"
      :crossorigin="crossorigin"
      :handle-preview="onPreview"
      @remove="handleRemove"
    >
      <template v-if="$slots.file" #default="{ file, index }">
        <slot name="file" :file="file" :index="index" />
      </template>
      <template #append>
        <UploadContent ref="uploadRef" v-bind="uploadContentProps">
          <slot v-if="$slots.trigger" name="trigger" />
          <slot v-if="!$slots.trigger && $slots.default" />
        </UploadContent>
      </template>
    </UploadList>

    <UploadContent
      v-if="!isPictureCard || (isPictureCard && !showFileList)"
      ref="uploadRef"
      v-bind="uploadContentProps"
    >
      <slot v-if="$slots.trigger" name="trigger" />
      <slot v-if="!$slots.trigger && $slots.default" />
    </UploadContent>

    <slot v-if="$slots.trigger" />
    <slot name="tip" />

    <UploadList
      v-if="!isPictureCard && showFileList"
      :disabled="disabled"
      :list-type="listType"
      :files="uploadFiles"
      :crossorigin="crossorigin"
      :handle-preview="onPreview"
      @remove="handleRemove"
    >
      <template v-if="$slots.file" #default="{ file, index }">
        <slot name="file" :file="file" :index="index" />
      </template>
    </UploadList>
  </div>
</template>

<script setup lang="ts">
import UploadList from "./UploadList.vue";
import UploadContent from "./UploadContent.vue";
import { ajaxUpload } from "./ajax";
import type { uploadProps, UploadContentInstance, UploadContentProps } from "./type";
import { useHandlers } from "./use-handlers";
import { uploadContextKey } from "./constants";

defineOptions({
  name: "Upload",
});

const props = withDefaults(defineProps<uploadProps>(), {
  action: "#",
  method: "post",
  disabled: false,
  withCredentials: true,
  drag: false,
  name: "file",
  showFileList: true,
  accept: "",
  multiple: false,
  data: () => ({}),
  fileList: () => [],
  autoUpload: true,
  listType: "text",
  headers: () => ({}),
  httpRequest: ajaxUpload,
  beforeUpload: () => {},
  onRemove: () => {},
  onStart: () => {},
  onSuccess: () => {},
  onProgress: () => {},
  onError: () => {},
  onExceed: () => {},
  onPreview: () => {},
});

const uploadRef = shallowRef<UploadContentInstance>();
const {
  uploadFiles,
  abort,
  submit,
  clearFiles,
  handleStart,
  handleError,
  handleRemove,
  handleSuccess,
  handleProgress,
  revokeFileObjectURL,
} = useHandlers(props, uploadRef);

const isPictureCard = computed(() => props.listType === "picture-card");

const uploadContentProps = computed<UploadContentProps>(() => ({
  ...props,
  fileList: uploadFiles.value,
  onStart: handleStart,
  onProgress: handleProgress,
  onSuccess: handleSuccess,
  onError: handleError,
  onRemove: handleRemove,
}));

onBeforeUnmount(() => {
  uploadFiles.value.forEach(revokeFileObjectURL);
});

// const uploadContextKey: InjectionKey<UploadContext> = Symbol("uploadContextKey");

provide(uploadContextKey, {
  accept: toRef(props, "accept"),
});

defineExpose({
  /** @description cancel upload request */
  abort,
  /** @description upload the file list manually */
  submit,
  /** @description clear the file list  */
  clearFiles,
  /** @description select the file manually */
  handleStart,
  /** @description remove the file manually */
  handleRemove,
});
</script>

<!-- <style scoped lang="less">
. {
}
</style> -->
