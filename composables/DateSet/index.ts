import { ref } from "vue";
import type { configType, DateSetType, QueryType } from "./type";
import type { NitroFetchOptions, NitroFetchRequest } from "nitropack";

export default class DataSet implements DateSetType {
  /** 开启自动查询 */
  autoQuery = false;
  /** transport 存在时queryUrl将无效 */
  queryUrl;
  queryParameter = {};
  /** transport 存在时queryUrl将无效 */
  transport;
  fields;
  queryform: QueryType[] = [];
  /** 主键如果有嵌套需要使用 */
  primaryKey;
  formQuery = {};
  tableData = ref<any>([]);
  currentPage = ref(1);
  /** 分页大小 */
  pageSize = ref(100);
  pageSizes = [100, 200, 300, 400];
  disabled = ref(false);
  butQuery = ref(false);
  total = ref(0);
  paging = true;
  multiple = false;
  /** 选中的行数据 */
  multipleSelection = ref([]);
  events;
  reserveSelection = false;
  loading = ref(false);

  constructor(dataSet: configType) {
    dataSet.autoQuery !== undefined && (this.autoQuery = dataSet.autoQuery);
    dataSet.queryUrl !== undefined && (this.queryUrl = dataSet.queryUrl);
    dataSet.transport !== undefined && (this.transport = dataSet.transport);
    this.fields = dataSet.fields;
    dataSet.primaryKey !== undefined && (this.primaryKey = dataSet.primaryKey);
    dataSet.paging !== undefined && (this.paging = dataSet.paging);
    dataSet.multiple !== undefined && (this.multiple = dataSet.multiple);
    dataSet.queryform && (this.queryform = dataSet.queryform);
    dataSet.pageSize && (this.pageSize.value = dataSet.pageSize);
    if (dataSet.pageSizes && dataSet.pageSizes.length) {
      this.pageSizes = dataSet.pageSizes;
      this.pageSize.value = dataSet.pageSizes[0];
    }
    this.events = dataSet.events || {};

    if (dataSet.reserveSelection !== undefined) {
      this.reserveSelection = dataSet.reserveSelection;
    }

    // 如果autoQuery为true调用query函数
    this.autoQuery && this.query();
  }

  async query(data?: { [index: string]: any }) {
    try {
      this.loading.value = true;
      let result: any[] | { list: any[]; total: number };
      let param: {
        [x: string]: string | number;
      } = {
        ...this.formQuery,
        ...data,
      };

      const beforeQueryResult =
        this.events.beforeQuery && this.events.beforeQuery({ dataSet: this, params: param });
      if (typeof beforeQueryResult === "boolean" && beforeQueryResult === false) {
        return;
      }
      if (typeof beforeQueryResult === "object") {
        param = { ...param, ...beforeQueryResult };
      }

      if (this.paging) param.page = this.currentPage.value;
      if (this.paging) param.pageSize = this.pageSize.value;

      if (this.transport?.read) {
        let requestConfig: { url: NitroFetchRequest; opt?: NitroFetchOptions<NitroFetchRequest> };
        if (typeof this.transport?.read === "function") {
          requestConfig = this.transport?.read(param);
        } else {
          requestConfig = this.transport?.read;
        }
        result = await useNuxtApp().$api(requestConfig.url, requestConfig.opt);
      } else if (this.queryUrl) {
        result = await useNuxtApp().$api(this.queryUrl, { method: "get", params: param });
      } else {
        throw new Error("queryUrl和transport.read至少有一项");
      }
      let list = [];
      if ("list" in result) {
        list = result.list;
        this.total.value = result.total || result.list.length;
      } else {
        list = result;
        this.total.value = result?.length || 0;
      }

      this.tableData.value = this.events.response ? this.events.response(list) : list;
      this.events?.onLoad && (await this.events.onLoad(this, this.tableData.value));
    } catch (error: any) {
      throw new Error(error);
    } finally {
      this.loading.value = false;
    }
  }

  /**
   * 加载数据
   * @description 会覆盖当前数据
   * @param data
   */
  load(data: any) {
    this.tableData.value = data;
    this.currentPage.value = 1;
  }

  /**
   * 设置分页大小
   */
  handleSize(size: number) {
    this.pageSize.value = size;
  }

  /**
   * 设置分页
   */
  handleCurrent(page: number) {
    this.currentPage.value = page;
  }

  /**
   * 设置加载状态
   */
  setLoading(loading: boolean) {
    this.butQuery.value = loading;
  }

  /**
   * 设置表单数据
   */
  setFormData(data: any) {
    this.formQuery = { ...this.formQuery, ...data };
  }

  /**
   * 设置选中数据
   */
  setMultipleSelection(data: any) {
    this.multipleSelection.value = data;
  }
}
