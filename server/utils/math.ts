/**
 * 范围随机数
 */
export function randomNumberRange(min: number, max: number) {
  return Math.round(Math.random() * (max - min)) + min;
}
