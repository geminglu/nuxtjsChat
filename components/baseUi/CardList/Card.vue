<template>
  <div :class="cardClass" v-bind="attrs">
    <div v-if="$slots.header" :class="[ui.header.base, ui.header.padding, ui.header.background]">
      <slot name="header" />
    </div>
    <div v-if="$slots.default" :class="[ui.body.base, ui.body.padding, ui.body.background]">
      <slot />
    </div>
    <div v-if="$slots.footer" :class="[ui.footer.base, ui.footer.padding, ui.footer.background]">
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, toRef, defineComponent } from "vue";
import type { PropType } from "vue";
import { twMerge, twJoin } from "tailwind-merge";
import { defu, createDefu } from "defu";

export function omit<T extends Record<string, any>, K extends keyof T>(
  object: T,
  keysToOmit: K[] | any[],
): Pick<T, Exclude<keyof T, K>> {
  const result = { ...object };

  for (const key of keysToOmit) {
    delete result[key];
  }

  return result;
}

export function get(
  object: Record<string, any>,
  path: (string | number)[] | string,
  defaultValue?: any,
): any {
  if (typeof path === "string") {
    path = path.split(".").map((key) => {
      const numKey = Number(key);
      return isNaN(numKey) ? key : numKey;
    });
  }

  let result: any = object;

  for (const key of path) {
    if (result === undefined || result === null) {
      return defaultValue;
    }

    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
}
const defuTwMerge = createDefu((obj, key, value, namespace) => {
  if (namespace === "default" || namespace.startsWith("default.")) {
    return false;
  }
  if (namespace === "popper" || namespace.startsWith("popper.")) {
    return false;
  }
  if (namespace.endsWith("avatar") && key === "size") {
    return false;
  }
  if (namespace.endsWith("chip") && key === "size") {
    return false;
  }
  if ((namespace.endsWith("badge") && key === "size") || key === "color" || key === "variant") {
    return false;
  }
  if (typeof obj[key] === "string" && typeof value === "string" && obj[key] && value) {
    // @ts-ignore
    obj[key] = customTwMerge(obj[key], value);
    return true;
  }
});
export type Strategy = "merge" | "override";
export function mergeConfig<T>(strategy: Strategy, ...configs: any[]): T {
  if (strategy === "override") {
    return defu({}, ...configs) as T;
  }

  return defuTwMerge({}, ...configs) as T;
}

export const useUI = <T,>(
  key: string,
  $ui?: Ref<(Partial<T> & { strategy?: Strategy }) | undefined>,
  $config?: Ref<T> | T,
  $wrapperClass?: Ref<string>,
  withAppConfig: boolean = false,
) => {
  const $attrs = useAttrs();
  const appConfig = useAppConfig();

  const ui = computed(() => {
    const _ui = toValue($ui);
    const _config = toValue($config);
    const _wrapperClass = toValue($wrapperClass);

    return mergeConfig<T>(
      _ui?.strategy || (appConfig.ui?.strategy as Strategy),
      _wrapperClass ? { wrapper: _wrapperClass } : {},
      _ui || {},
      process.dev || withAppConfig ? get(appConfig.ui, key, {}) : {},
      _config || {},
    );
  });

  const attrs = computed(() => omit($attrs, ["class"]));

  return {
    ui,
    attrs,
  };
};

export default defineComponent({
  name: "Card",
  inheritAttrs: false,
  props: {
    as: {
      type: String,
      default: "div",
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => "",
    },
    ui: {
      type: Object as PropType<{ [x: string]: string }>,
      default: () => ({}),
    },
  },
  setup(props) {
    const { ui, attrs } = useUI("card", toRef(props, "ui"), {
      base: "",
      background: "bg-white dark:bg-gray-900",
      divide: "divide-y divide-gray-200 dark:divide-gray-800",
      ring: "ring-1 ring-gray-200 dark:ring-gray-800",
      rounded: "rounded-lg overflow-hidden",
      shadow: "shadow mb-4",
      body: {
        base: "",
        background: "",
        padding: "",
      },
      header: {
        base: "",
        background: "",
        padding: "px-4 py-4 sm:px-6",
      },
      footer: {
        base: "",
        background: "",
        padding: "px-4 py-4 sm:px-6",
      },
    });

    const cardClass = computed(() => {
      return twMerge(
        twJoin(
          ui.value.base,
          ui.value.rounded,
          ui.value.divide,
          ui.value.ring,
          ui.value.shadow,
          ui.value.background,
        ),
        props.class,
      );
    });

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      cardClass,
    };
  },
});
</script>
