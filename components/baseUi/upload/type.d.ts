import type { Awaitable } from "~/typings/typescript";
import type { ComputedRef } from "vue";
import type Upload from "./upload.vue";
import type UploadContent from "./UploadContent.vue";
import type UploadDragger from "./UploadDragger.vue";

export interface UploadRawFile extends File {
  uid: number;
}

export interface UploadProgressEvent extends ProgressEvent {
  percent: number;
}

export type UploadData = Record<string, any>;

export interface UploadRequestOptions {
  action: string;
  method: string;
  data: Record<string, string | Blob | [string | Blob]>;
  filename: string;
  file: UploadRawFile;
  headers: Headers | Record<string, string | number | null | undefined>;
  onError: (evt: UploadAjaxError) => void;
  onProgress: (evt: UploadProgressEvent) => void;
  onSuccess: (response: any) => void;
  withCredentials: boolean;
}

export type UploadRequestHandler = (
  options: UploadRequestOptions,
) => XMLHttpRequest | Promise<unknown>;

export type uploadListTypes = "text" | "picture" | "picture-card";

export type UploadStatus = "ready" | "uploading" | "success" | "fail";

export type crossorigin = "anonymous" | "use-credentials" | "";

export interface uploadBaseProps {
  action: string;
  headers: Headers | Record<string, any>;
  method: string;
  multiple: boolean;
  data: Awaitable<UploadData> | ((rawFile: UploadRawFile) => Awaitable<UploadData>);
  name: string;
  drag: boolean;
  /**
   * @description whether cookies are sent
   */
  withCredentials: boolean;
  showFileList: boolean;
  /**
   * @description accepted [file types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept), will not work when `thumbnail-mode === true`
   */
  accept: string;
  fileList: UploadUserFile[];
  autoUpload: boolean;
  listType: uploadListTypes;
  disabled: boolean;
  /**
   * maximum number of uploads allowed
   */
  limit?: number;
  httpRequest: (options: UploadRequestOptions) => XMLHttpRequest | Promise<unknown>;
}
export interface uploadProps extends Partial<uploadBaseProps> {
  beforeUpload?: UploadHooks["beforeUpload"];
  beforeRemove?: UploadHooks["beforeRemove"];
  onRemove?: UploadHooks["onRemove"];
  onChange?: UploadHooks["onChange"];
  onPreview?: UploadHooks["onPreview"];
  onSuccess?: UploadHooks["onSuccess"];
  onProgress?: UploadHooks["onProgress"];
  onError?: UploadHooks["onError"];
  onExceed?: UploadHooks["onExceed"];
  crossorigin?: crossorigin;
}

export interface UploadFile {
  name: string;
  percentage?: number;
  status: UploadStatus;
  size?: number;
  response?: unknown;
  uid: number;
  url?: string;
  raw?: UploadRawFile;
}

export type UploadFiles = UploadFile[];

export interface uploadListProps {
  files: UploadFiles;
  disabled: boolean;
  handlePreview: (uploadFile: UploadFile) => void;
  listType: uploadListTypes;
  crossorigin?: crossorigin;
}

export type UploadListEmits = typeof uploadListEmits;

export interface UploadContext {
  accept: ComputedRef<string>;
}

export interface UploadContentProps extends uploadBaseProps {
  beforeUpload: UploadHooks["beforeUpload"];
  onRemove: (file: UploadFile | UploadRawFile, rawFile?: UploadRawFile) => void;
  onStart: (rawFile: UploadRawFile) => void;
  onSuccess: (response: any, rawFile: UploadRawFile) => unknown;
  onProgress: (evt: UploadProgressEvent, rawFile: UploadRawFile) => void;
  onError: (err: UploadAjaxError, rawFile: UploadRawFile) => void;
  onExceed: UploadHooks["onExceed"];
}
export interface UploadHooks {
  beforeUpload: (
    rawFile: UploadRawFile,
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  ) => Awaitable<void | undefined | null | boolean | File | Blob>;
  beforeRemove: (uploadFile: UploadFile, uploadFiles: UploadFiles) => Awaitable<boolean>;
  onRemove: (uploadFile: UploadFile, uploadFiles: UploadFiles) => void;
  onChange: (uploadFile: UploadFile, uploadFiles: UploadFiles) => void;
  onPreview: (uploadFile: UploadFile) => void;
  onSuccess: (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => void;
  onProgress: (evt: UploadProgressEvent, uploadFile: UploadFile, uploadFiles: UploadFiles) => void;
  onError: (error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) => void;
  onExceed: (files: File[], uploadFiles: UploadUserFile[]) => void;
}

export type UploadInstance = InstanceType<typeof Upload>;

export type UploadContentInstance = InstanceType<typeof UploadContent>;

export interface uploadDraggerProps {
  disabled: boolean;
}

export type UploadDraggerInstance = InstanceType<typeof UploadDragger>;

export type UploadUserFile = Omit<UploadFile, "status" | "uid"> &
  Partial<Pick<UploadFile, "status" | "uid">>;
