import type { UploadFile } from "~/components/baseUi/upload/type";
import path from "path-browserify";

/**
 * 范围随机数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @return {number} 最小值与最大值之间的一个整数
 */
export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Checks if `value` is `null` or `undefined`.
 *
 * @category Lang
 * @param value The value to check.
 * @returns Returns `true` if `value` is nullish, else `false`.
 * @example
 *
 * _.isNil(null);
 * // => true
 *
 * _.isNil(void 0);
 * // => true
 *
 * _.isNil(NaN);
 * // => false
 */
export function isNil(value: any) {
  return value == null;
}

/**
 * 字符串转base64
 * @param str
 */
export function stringToBase64(str: string) {
  return btoa(encodeURI(str));
}

/**
 * base64转字符串
 * @param base64
 */
export function base64ToString(base64: string) {
  return decodeURI(atob(base64));
}

export function fullUrl(url: string) {
  const buildAssetsDir = useNuxtApp().payload.config?.app.buildAssetsDir as string;
  return path.join(buildAssetsDir, url);
}

/**
 * 扩展file
 */
export function extendFile(file: UploadFile): UploadFile & { icon: string } {
  const extendName = file.name.split(".").pop()?.toLowerCase();
  const fileExtend: { [x: string]: string } = {
    pdf: "assets/svg/PDF.svg",
    doc: "assets/svg/Doc.svg",
    docx: "assets/svg/Doc.svg",
    xls: "assets/svg/Excel.svg",
    xlsx: "assets/svg/Excel.svg",
    ppt: "assets/svg/PPT.svg",
    pptx: "assets/svg/PPT.svg",
    txt: "assets/svg/TXT.svg",
    zip: "assets/svg/Zip.svg",
    rar: "assets/svg/Zip.svg",
    mp3: "assets/svg/Mp3.svg",
    wav: "assets/svg/Wav.svg",
    mp4: "assets/svg/Mov.svg",
    avi: "assets/svg/Mov.svg",
    rmvb: "assets/svg/Mov.svg",
    wmv: "assets/svg/Mp3.svg",
    flv: "assets/svg/Mov.svg",
    mov: "assets/svg/Mov.svg",
    gif: "assets/svg/Gif.svg",
    png: "assets/svg/tupian.svg",
    jpg: "assets/svg/tupian.svg",
    jpeg: "assets/svg/tupian.svg",
    svg: "assets/svg/Svg.svg",
    webp: "assets/svg/tupian.svg",
    html: "assets/svg/Html.svg",
    ai: "assets/svg/Ai.svg",
    pr: "assets/svg/Pr.svg",
    ps: "assets/svg/Ps.svg",
    swf: "assets/svg/Swf.svg",
    default: "assets/svg/unknownFile.svg",
  };

  return { ...file, icon: fullUrl(fileExtend[extendName || "default"] || fileExtend.default) };
}
