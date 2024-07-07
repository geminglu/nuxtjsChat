/**
 * 范围随机数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @return {number} 最小值与最大值之间的一个整数
 */
export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
