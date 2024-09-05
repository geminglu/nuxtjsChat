export interface stepsProps {
  /**
   * 设置当前激活步骤
   */
  active: number;
  steps: stepPropsType[];
  ui?: objectKey;
}

type objectKey = { [key: string]: objectKey | string };
export interface stepPropsType {
  title: string;
}
