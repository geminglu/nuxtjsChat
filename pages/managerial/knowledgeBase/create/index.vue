<template>
  <div>
    <steps :steps="stepsv" :active="active" />
    <UButton v-if="active !== 0" @click="next(-1)">{{
      $t("knowledge_base.previous_step")
    }}</UButton>
    <UButton v-if="active !== stepsv.length" @click="next(1)">{{
      $t("knowledge_base.next_step")
    }}</UButton>
    <div>
      <h2 class="text-lg font-semibold">{{ $t("knowledge_base.select_data_source") }}</h2>
      <ul class="list-none flex">
        <li
          :class="`${ui.sourcesList} ${dataSourceType === 'upload_file' && ui.active}`"
          @click="dataSourceType = 'upload_file'"
        >
          <div :class="ui.sourcesIcon">
            <Icon name="mdi:file-document" class="text-primary w-6 h-6" />
          </div>
          <span class="align-middle">{{ $t("knowledge_base.import_file") }}</span>
        </li>
        <li
          :class="`${ui.sourcesList} ${dataSourceType === 'yuque' && ui.active}`"
          class="ml-4"
          @click="dataSourceType = 'yuque'"
        >
          <div :class="ui.sourcesIcon">
            <img src="/assets/svg/yuque.svg" class="w-6 align-middle inline-block" />
          </div>
          <span class="align-middle">{{ $t("knowledge_base.sync_yuque") }}</span>
        </li>
        <li
          :class="`${ui.sourcesList} ${dataSourceType === 'web' && ui.active}`"
          class="ml-4"
          @click="dataSourceType = 'web'"
        >
          <div :class="ui.sourcesIcon">
            <Icon name="mdi:web" class="text-primary w-6 h-6" />
          </div>
          <span class="align-middle">{{ $t("knowledge_base.sync_web") }}</span>
        </li>
      </ul>
    </div>

    <Upload
      v-model:file-list="fileList"
      class="upload-demo"
      action="/api/upload/uploadFile"
      multiple
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :limit="3"
      :on-exceed="handleExceed"
    >
      <!-- <template #trigger>
        <UButton>triggerss</UButton>
      </template> -->
      <UButton>Click to upload</UButton>

      <template #tip>
        <div class="el-upload__tip">jpg/png files with a size less than 500KB.</div>
      </template>
    </Upload>

    <Upload
      v-model:file-list="fileList"
      class="upload-demo"
      action="/api/upload/uploadFile"
      multiple
      list-type="picture-card"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :limit="13"
      :on-exceed="handleExceed"
    >
      <!-- <template #trigger>
        <UButton>triggerss</UButton>
      </template> -->
      <UButton>Click to upload</UButton>

      <template #tip>
        <div class="el-upload__tip">jpg/png files with a size less than 500KB.</div>
      </template>
    </Upload>
    <hr />
    <Upload
      ref="upload"
      list-type="picture"
      class="upload-demo"
      action="/api/upload/uploadFile"
      :limit="10"
      :on-exceed="handleExceed"
      :auto-upload="false"
    >
      <template #trigger>
        <UButton type="primary">select file</UButton>
      </template>
      <UButton class="ml-3" color="green" @click="submitUpload"> upload to server </UButton>
      <template #tip>
        <div class="el-upload__tip text-red">limit 1 file, new file will cover the old file</div>
      </template>
    </Upload>
  </div>
</template>

<script setup lang="ts">
import Upload from "@/components/baseUi/upload/index";
import steps from "~/components/baseUi/steps";
import type { stepPropsType } from "~/components/baseUi/steps/type";
import type { UploadInstance, uploadProps, UploadUserFile } from "~/components/baseUi/upload/type";

defineOptions({
  name: "KnowledgeBaseCreate",
});

const { t } = useI18n();
const toast = useToast();
const active = ref(0);
const dataSourceType = ref<"upload_file" | "yuque" | "web">("upload_file");

const stepsv: stepPropsType[] = [
  {
    title: t("knowledge_base.select_data_source"),
  },
  {
    title: t("knowledge_base.text_segmentation"),
  },
  {
    title: t("knowledge_base.processed_completed"),
  },
];
function next(step: number) {
  if ((step === -1 && active.value === 0) || (step === 1 && active.value >= stepsv.length)) return;
  active.value = active.value + step;
}

const { ui } = useUI("steps", ref(), {
  sourcesList:
    "flex items-center rounded-xl border dark:border-stone-600 w-48 h-16 px-4 cursor-pointer shadow-sm hover:shadow-md transition",
  sourcesIcon:
    "flex items-center justify-center p-1 w-8 h-8 rounded-lg mr-2 bg-primary-100 dark:bg-primary-950",
  active: "border-primary dark:border-primary-500",
});

const fileList = ref<UploadUserFile[]>([
  {
    name: "element-plus-logo.svg",
    url: "https://element-plus.org/images/element-plus-logo.svg",
  },
  {
    name: "element-plus-logo2.svg",
    url: "https://element-plus.org/images/element-plus-logo.svg",
  },
  {
    name: "element-plus-logo3.svg",
    url: "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
  },
]);

const handleRemove: uploadProps["onRemove"] = (file, uploadFiles) => {
  // console.log("Remove", file, uploadFiles);
};

const handlePreview: uploadProps["onPreview"] = (uploadFile) => {
  // console.log("Preview", uploadFile);
};

const handleExceed: uploadProps["onExceed"] = (files, uploadFiles) => {
  toast.add({
    title: `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`,
  });
};

const beforeRemove: uploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  return true;
  //
  // return ElMessageBox.confirm(`Cancel the transfer of ${uploadFile.name} ?`).then(
  //   () => true,
  //   () => false,
  // );
};
const upload = ref<UploadInstance>();
const submitUpload = () => {
  upload.value!.submit();
};
</script>

<style scoped lang="less"></style>
