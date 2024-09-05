<template>
  <nav aria-label="Progress">
    <ol role="list" class="overflow-hidden">
      <li
        v-for="(step, stepIdx) in steps"
        :key="step.title"
        :class="[stepIdx !== steps.length - 1 ? ui.body.padding : '', 'relative']"
      >
        <template v-if="stepIdx < active">
          <div class="relative flex items-start group">
            <span
              class="transition relative z-10 w-4 h-4 flex items-center justify-center bg-primary-500 rounded-full group-hover:bg-primary-600"
            >
              <Icon name="heroicons:check-16-solid" class="text-white w-3 h-3 font-semibold" />
            </span>
            <span :class="ui.text">
              {{ step.title }}
            </span>
          </div>
        </template>
        <template v-else-if="stepIdx === active">
          <div class="relative flex items-start group" aria-current="step">
            <span
              class="relative z-10 w-4 h-4 flex items-center justify-center rounded-full transition wha"
            >
              <span
                class="w-2 h-2 bg-primary-500 group-hover:bg-primary-600 rounded-full transition"
              />
            </span>
            <span :class="ui.text" class="text-primary-500 dark:text-primary-400">
              {{ step.title }}
            </span>
          </div>
        </template>
        <template v-else>
          <div class="relative flex items-start group">
            <!-- <span class="h-4 flex items-center" aria-hidden="true"> -->
            <span class="relative z-10 w-4 h-4 flex items-center justify-center">
              <span
                class="h-2 w-2 rounded-full bg-gray-300 group-hover:bg-gray-400 group-hover:dark:bg-gray-400 transition"
              />
            </span>
            <!-- </span> -->
            <span
              :class="ui.text"
              class="text-gray-500 dark:text-gray-400 group-hover:dark:text-gray-500 group-hover:text-gray-600 transition"
              >{{ step.title }}</span
            >
          </div>
        </template>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import type { stepsProps } from "../type";

defineOptions({
  name: "Steps",
});

const props = withDefaults(defineProps<stepsProps>(), {
  active: 0,
});

const { ui } = useUI("steps", toRef(props, "ui"), {
  text: "ml-3 min-w-0 flex flex-col text-xs font-semibold tracking-wide uppercase",
  body: {
    padding: "pb-4",
  },
});
</script>

<style lang="css" scoped>
.wha {
  background-color: rgb(var(--color-primary-500) / 0.5);
}
</style>
