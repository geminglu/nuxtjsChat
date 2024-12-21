import type { Ref } from "vue";
import type { JSX } from "vue/jsx-runtime";
import type { NitroFetchRequest, NitroFetchOptions } from "nitropack";

export interface headerButtonsObj {
  name: string;
  icon?: string;
  click: (dataSet: DateSetType, param: { [index: string]: any }) => void;
}

export type headerButton = "refresh" | "dele";

export type headerButtonsType = headerButton | headerButtonsObj | JSX.Element;
interface TransportType {
  read:
    | { url: NitroFetchRequest; opt?: NitroFetchOptions<NitroFetchRequest> }
    | ((param: any) => { url: NitroFetchRequest; opt?: NitroFetchOptions<NitroFetchRequest> });
}
interface FieldsTextType {
  type: "text";
}
interface FieldsDateType {
  type: "date";
  format?: string;
}
interface FieldsDatetimeType {
  type: "datetime";
  format?: string;
}
interface FieldsDateTimeType {
  type: "time";
  format?: string;
}
interface FieldsUplookType {
  type: "uplook";
  field: string;
  value: any;
}

type FieldsExtend =
  | FieldsTextType
  | FieldsDateType
  | FieldsDatetimeType
  | FieldsDateTimeType
  | FieldsUplookType;

type FieldsType = {
  name: string;
  label: string /** 对应列的宽度 */;
  width?: string | number;
  /** 对应列的最小宽度， 对应列的最小宽度， 与 width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列 */
  minWidth?: string | number;
  /** 列是否固定在左侧或者右侧。 true 表示固定在左侧 */
  fixed?: string | boolean;
  render?: (param: any) => JSX.Element;
} & FieldsExtend;
interface uplookType {
  field: string;
  value: any;
}
export interface QueryType {
  name: string;
  type: "uplook" | "text" | "date" | "datetime";
  label: string;
  /** 默认值 */
  defaultValue?: any;
  uplookList?: uplookType[];
  url?: string;
  fieldId?: string;
  fielidText?: string;
  /**
   * 日期组件显示在输入框中的格式
   */
  format?: string;
  required?: boolean;
}

interface EventType {
  /**
   * 点击搜索表单重置时调用
   */
  reset: () => void;
  /**
   * 查询事件前，返回值为 false 将阻止查询
   * @description 如果返回 false 将停止查询，如果返回对象会覆盖查询参数，如果返回 undefined 不会影响查询逻辑
   */
  beforeQuery: (data: {
    // eslint-disable-next-line no-use-before-define
    dataSet: DateSetType;
    params: { [index: string]: any };
  }) => { [index: string]: any } | boolean | void;
  /**
   * 响应拦截器
   * @description 需要返回一组数据
   */
  response: (res: any[]) => any[];
  /**
   * 数据加载完成后执行
   */
  // eslint-disable-next-line no-use-before-define
  onLoad: (dataSet: DateSetType, data: any[]) => void;
}

export interface configType {
  queryform?: QueryType[];
  /** 开启自动查询 */
  autoQuery?: boolean;
  /** transport 存在时queryUrl将无效 */
  queryUrl?: NitroFetchRequest;
  queryParameter?: { [index: string]: any };
  /** transport 存在时queryUrl将无效 */
  transport?: TransportType;
  fields: FieldsType[];
  /** 主键如果有嵌套需要使用 */
  primaryKey?: string;
  pageSizes?: number[];
  /** 分页大小,默认100 */
  pageSize?: number;
  /** 是否有分页 */
  paging?: boolean;
  /** 多选 */
  multiple?: boolean;
  /**
   * 事件
   */
  events?: Partial<EventType>;

  /** 是否保留被选中的数据 */
  reserveSelection?: boolean;
}
export interface DateSetType extends Omit<configType, "pageSize" | "queryform" | "pageSizes"> {
  tableData: Ref<any[]>;
  queryform: QueryType[];
  /** 分页大小,默认100 */
  pageSize: Ref<number>;
  pageSizes: number[];
  currentPage: Ref<number>;
  disabled: Ref<boolean>;
  butQuery: Ref<boolean>;
  total: Ref<number>;
  formQuery: { [index: string]: string };
  /** 选中的行数据 */
  multipleSelection: Ref<Array<any>>;
  /** 数据加载状态 */
  loading: Ref<boolean>;
  query: (data?: { [index: string]: any }) => any;
  /** 加载数据 */
  load: (data: any) => any;
  /** 设置分页大小 */
  handleSize: (size: number) => void;
  /** 设置分页 */
  handleCurrent: (page: number) => void;
  /** 设置加载状态 */
  setLoading: (loading: boolean) => void;
  /** 设置表单数据 */
  setFormData: (data: any) => void;
  setMultipleSelection: (data: any) => void;
}
