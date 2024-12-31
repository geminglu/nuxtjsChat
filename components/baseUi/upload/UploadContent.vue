<template>
  <div
    :tabindex="disabled ? '-1' : '0'"
    @click="handleClick"
    @keydown.self.enter.space="handleKeydown"
  >
    <template v-if="drag">
      <UploadDragger :disabled="disabled" @file="uploadFiles">
        <slot />
      </UploadDragger>
    </template>
    <template v-else>
      <slot />
    </template>
    <input
      ref="inputRef"
      class="hidden"
      :name="name"
      :disabled="disabled"
      :multiple="multiple"
      :accept="accept"
      type="file"
      @change="handleChange"
      @click.stop
    >
  </div>
</template>

<script lang="ts" setup>
import type {
  UploadFile,
  UploadHooks,
  UploadRawFile,
  UploadRequestOptions,
  UploadContentProps,
} from "./type";
// eslint-disable-next-line vue/prefer-import-from-vue
import { isPlainObject, isFunction } from "@vue/shared";
import UploadDragger from "./UploadDragger.vue";
import type { Entries } from "type-fest";
import { genFileId } from "./use-handlers";

defineOptions({
  name: "UploadContent",
});

const entriesOf = <T extends object>(arr: T) => Object.entries(arr) as Entries<T>;

const props = defineProps<UploadContentProps>();

const disabled = computed(() => {
  return props.disabled;
});

const requests = shallowRef<Record<string, XMLHttpRequest | Promise<unknown>>>({});
const inputRef = shallowRef<HTMLInputElement>();

const uploadFiles = (files: File[]) => {
  if (files.length === 0) return;

  const { autoUpload, limit, fileList, multiple, onStart, onExceed } = props;

  if (limit && fileList.length + files.length > limit) {
    onExceed(files, fileList);
    return;
  }

  if (!multiple) {
    files = files.slice(0, 1);
  }

  for (const file of files) {
    const rawFile = file as UploadRawFile;
    rawFile.uid = genFileId();
    onStart(rawFile);
    if (autoUpload) upload(rawFile);
  }
};

const upload = async (rawFile: UploadRawFile): Promise<void> => {
  inputRef.value!.value = "";

  if (!props.beforeUpload) {
    return doUpload(rawFile);
  }

  let hookResult: Exclude<ReturnType<UploadHooks["beforeUpload"]>, Promise<any>>;
  let beforeData: UploadContentProps["data"] = {};

  try {
    // origin data: Handle data changes after synchronization tasks are executed
    const originData = props.data;
    const beforeUploadPromise = props.beforeUpload(rawFile);
    beforeData = isPlainObject(props.data) ? JSON.parse(JSON.stringify(props.data)) : props.data;
    hookResult = await beforeUploadPromise;
    if (
      isPlainObject(props.data) &&
      JSON.parse(JSON.stringify(originData)) === JSON.parse(JSON.stringify(beforeData))
    ) {
      beforeData = JSON.parse(JSON.stringify(props.data));
    }
  } catch {
    hookResult = false;
  }

  if (hookResult === false) {
    props.onRemove(rawFile);
    return;
  }

  let file: File = rawFile;
  if (hookResult instanceof Blob) {
    if (hookResult instanceof File) {
      file = hookResult;
    } else {
      file = new File([hookResult], rawFile.name, {
        type: rawFile.type,
      });
    }
  }

  doUpload(
    Object.assign(file, {
      uid: rawFile.uid,
    }),
    beforeData,
  );
};

const resolveData = async (
  data: UploadContentProps["data"],
  rawFile: UploadRawFile,
): Promise<Record<string, any>> => {
  if (isFunction(data)) {
    return data(rawFile);
  }

  return data;
};

const doUpload = async (rawFile: UploadRawFile, beforeData?: UploadContentProps["data"]) => {
  const {
    headers,
    data,
    method,
    withCredentials,
    name: filename,
    action,
    onProgress,
    onSuccess,
    onError,
    httpRequest,
  } = props;

  try {
    beforeData = await resolveData(beforeData ?? data, rawFile);
  } catch {
    props.onRemove(rawFile);
    return;
  }

  const { uid } = rawFile;
  const options: UploadRequestOptions = {
    headers: headers || {},
    withCredentials,
    file: rawFile,
    data: beforeData ?? data,
    method,
    filename,
    action,
    onProgress: (evt) => {
      onProgress(evt, rawFile);
    },
    onSuccess: (res) => {
      onSuccess(res, rawFile);
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete requests.value[uid];
    },
    onError: (err) => {
      onError(err, rawFile);
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete requests.value[uid];
    },
  };
  const request = httpRequest(options);
  requests.value[uid] = request;
  if (request instanceof Promise) {
    request.then(options.onSuccess, options.onError);
  }
};

const handleChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;
  uploadFiles(Array.from(files));
};

const handleClick = () => {
  if (!disabled.value) {
    inputRef.value!.value = "";
    inputRef.value!.click();
  }
};

const handleKeydown = () => {
  handleClick();
};

const abort = (file?: UploadFile) => {
  const _reqs = entriesOf(requests.value).filter(
    file ? ([uid]) => String(file.uid) === uid : () => true,
  );
  _reqs.forEach(([uid, req]) => {
    if (req instanceof XMLHttpRequest) req.abort();
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete requests.value[uid];
  });
};

defineExpose({
  abort,
  upload,
});
</script>
