<template>
  <div class="Table flex flex-col flex-1 w-full">
    <template v-if="dateSet.queryform && dateSet.queryform.length">
      <UForm ref="formRef" :state="form" class="flex" @submit="handelQuery">
        <div class="flex flex-wrap flex-1 mt-4">
          <UFormGroup
            v-for="item in dateSet.queryform"
            :key="item.name"
            :label="`${item.label}:`"
            :name="item.name"
            :required="item.required"
            :ui="{
              wrapper: 'flex items-center mr-4 mb-4',
              label: { base: 'mr-2 w-32 text-right' },
              container: 'mt-0',
            }"
          >
            <UInput v-model="form[item.name]" :ui="{ base: 'w-48' }" />
          </UFormGroup>
          <div class="flex flex-1 justify-end items-center mb-4">
            <UButton
              variant="outline"
              :loading="reLoading"
              :disabled="dateSet.loading.value"
              class="ml-2"
              :ui="{ base: 'mr-2' }"
              @click="resetForm"
            >
              {{ clearText || $t("common.reset") }}
            </UButton>
            <UButton type="submit" :disabled="dateSet.loading.value" :loading="loading">
              {{ searchText || $t("common.search") }}
            </UButton>
          </div>
        </div>
      </UForm>
    </template>
    <div v-if="headerButtons.length" class="headerButtons flex">
      <span v-for="(item, i) in headerButtons" :key="i" class="ml-4">
        <UButton
          v-if="typeof item === 'string' && item === 'refresh'"
          icon="i-heroicons-arrow-path-20-solid"
          :label="$t('common.refresh')"
          :disabled="dateSet.loading.value"
          @click="query"
        />
        <UButton
          v-if="typeof item === 'object' && 'name' in item"
          :icon="item.icon"
          :label="item.name"
          @click="item.click(dateSet, form)"
        />
        <ExpandDom
          v-if="typeof item === 'object' && 'type' in item && 'props' in item"
          :render="item"
        />
      </span>
    </div>
    <UTable
      v-model="selected"
      :loading="dateSet.loading.value"
      :rows="dateSet.tableData.value"
      :columns="dateSet.fields.map((item) => ({ key: item.name, label: item.label }))"
      :ui="{ wrapper: 'flex-1', thead: 'relative backdrop-blur sticky top-0 bg-[length:4px_4px]' }"
    >
      <template v-for="item in dateSet.fields" :key="item.name" #[`${item.name}-data`]="{ row }">
        <ExpandDom v-if="item.render" :render="item.render" :params="row" />
        <template v-else-if="item.type === 'date'">
          {{ row[item.name] && dayjs(row[item.name]).format(item.format || "YYYY/MM/DD") }}
        </template>
        <template v-else-if="item.type === 'datetime'">
          {{ row[item.name] && dayjs(row[item.name]).format(item.format || "YYYY/MM/DD HH:MM:ss") }}
        </template>
        <template v-else-if="item.type === 'time'">
          {{ row[item.name] && dayjs(row[item.name]).format(item.format || "HH:MM:ss") }}
        </template>
      </template>
    </UTable>
    <div
      class="flex justify-end items-center flex-wrap py-3.5 border-t text-sm border-gray-200 dark:border-gray-700"
    >
      <template v-for="item in pagingLayout.replaceAll(' ', '').split(',')" :key="item">
        <span v-if="item === 'total'" class="ml-4">
          {{ $t("table.total", { total: dateSet.total }) }}
        </span>
        <USelect
          v-if="item === 'sizes'"
          v-model="pageSize"
          :disabled="dateSet.loading.value"
          class="ml-4 w-24"
          :options="
            dateSet.pageSizes.map((item) => ({ label: `${item}/${$t('table.page')}`, value: item }))
          "
          @update:model-value="handleSizeChange"
        />
        <UPagination
          v-if="item === 'pager'"
          v-model="currentPage"
          class="ml-4"
          :page-count="dateSet.pageSize?.value"
          :divider="divider"
          :disabled="dateSet.loading.value"
          :total="dateSet.total.value"
          :size="props.size"
          :max="pagingMax"
          @update:model-value="handleCurrentChange"
        />
        <span v-if="item === 'jumper'" class="flex items-center ml-4">
          Go to &nbsp;
          <input
            :value="currentPage"
            type="number"
            :disabled="dateSet.loading.value"
            inputmode="numeric"
            class="numeric relative block w-14 disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 form-input rounded-md placeholder-gray-400 dark:placeholder-gray-500 text-sm px-2.5 py-1.5 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-center"
            @change="(e: Event) => handleCurrentChange((e.target as HTMLInputElement).value as unknown as number)"
          >
        </span>
      </template>
    </div>
  </div>
</template>

<script setup lang="tsx">
import type { Form } from "#ui/types";
import dayjs from "dayjs";
import type { DateSetType, headerButtonsType } from "~/composables/DateSet/type";

defineOptions({
  name: "BaseTable",
});

interface Schema {
  [x: string]: any;
}

const props = defineProps({
  dateSet: {
    type: Object as PropType<DateSetType>,
    required: true,
  },
  headerButtons: {
    type: Array as PropType<headerButtonsType[]>,
    default: () => [],
  },
  border: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<"md" | "2xs" | "xs" | "sm" | "lg" | "xl">,
    default: "sm",
  },
  background: {
    type: Boolean,
    default: false,
  },
  /** 搜索按钮描述 */
  searchText: {
    type: String,
    default: "",
  },
  clearText: {
    type: String,
    default: "",
  },
  divider: {
    type: String,
    default: "\u2026",
  },
  /**
   * 分页布局，子组件分别为 "total, sizes, pager, jumper"
   */
  pagingLayout: {
    type: String,
    default: "total, sizes, pager, jumper",
  },
  pagingMax: {
    type: Number,
    default: 7,
  },
});

const formRef = ref<Form<Schema>>();
const selected = ref([]);
const loading = ref(false);
const reLoading = ref(false);

const formQuery: { [index: string]: string } = {};
const currentPage = ref(props.dateSet.currentPage.value);
const pageSize = ref(props.dateSet.pageSize.value);

props.dateSet?.queryform &&
  props.dateSet.queryform?.forEach((item) => {
    formQuery[item.name] = item.defaultValue || "";
  });
const form = ref<Schema>({ ...formQuery });

// Object.defineProperty(props.dateSet, "formQuery", {
//   set(value) {
//     console.log(1111111111);

//     for (const key in value) {
//       form.value[key] = value[key];
//     }
//   },
// });

// new Proxy(props.dateSet.formQuery, {
//   set(target, key, value) {
//     console.log(32423, target, key, value);

//     form.value[key] = value;
//     return true;
//   },
// });

async function query() {
  await props.dateSet.query();
}

/**
 * 查询按钮的处理事件
 */
async function handelQuery() {
  loading.value = true;
  try {
    props.dateSet.setFormData(form.value);
    await query();
  } catch (error: any) {
    throw new Error(error);
  } finally {
    loading.value = false;
  }
}

function handleSizeChange(val: number) {
  val = parseInt((val || props.dateSet.pageSizes[0]).toString());
  const maxPage = Math.ceil(props.dateSet.total.value / val);
  if (maxPage < props.dateSet.currentPage.value) {
    currentPage.value = maxPage;
    props.dateSet.handleCurrent(maxPage);
  }
  props.dateSet.handleSize(val);
  query();
}

function handleCurrentChange(val: number) {
  val = parseInt((val || 1).toString());
  const maxPage = Math.ceil(props.dateSet.total.value / props.dateSet.pageSize.value);
  if (maxPage < val) {
    val = maxPage;
  }
  if (parseInt(val.toString()) < 1) {
    val = 1;
  }
  currentPage.value = val;
  props.dateSet.handleCurrent(val);
  query();
}

async function resetForm() {
  try {
    reLoading.value = true;
    formRef.value?.clear && formRef.value.clear();
    props.dateSet.events?.reset && props.dateSet.events.reset();
    form.value = { ...formQuery };
    props.dateSet.setFormData(form.value);
    await query();
  } catch (error: any) {
    throw new Error(error);
  } finally {
    reLoading.value = false;
  }
}

defineExpose({
  // multipleSelection,
});

const ExpandDom = defineComponent({
  name: "ExpandDom",
  functional: true,
  props: {
    render: {
      type: [Function, Object],
      required: true,
    },
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  render() {
    return typeof this.render === "function" ? this.render(this.params) : this.render;
  },
});
</script>

<style scoped lang="less">
.numeric[type="number"] {
  -moz-appearance: textfield;
}
.numeric::-webkit-outer-spin-button,
.numeric::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
