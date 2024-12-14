import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import config from "~/config";
import type { Options } from "formidable";

export async function FetchWithAuth(
  this: { username: string | null; password: string | null },
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  const headers = new Headers(init?.headers);
  const authorization = btoa(`${this?.username}:${this?.password}`);
  headers.set("Authorization", `Basic ${authorization}`);
  return fetch(input, { ...init, headers });
}

const uploadDir = path.resolve(config.uploadFilePath);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

export function uploadIncomingForm(options?: Partial<Options> | undefined) {
  return new IncomingForm({
    uploadDir, // 上传文件保存路径
    keepExtensions: true, // 保留文件扩展名
    ...options,
  });
}
