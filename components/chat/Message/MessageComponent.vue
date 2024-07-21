<template>
  <div
    ref="messageRef"
    class="flex w-full mb-6 overflow-hidden"
    :class="[{ 'flex-row-reverse': inversion }]"
  >
    <div
      class="flex items-center justify-center flex-shrink-0 h-8 overflow-hidden rounded-full basis-8"
      :class="[inversion ? 'ml-2' : 'mr-2']"
    >
      <Avatar :image="inversion" />
    </div>
    <div class="overflow-hidden text-sm" :class="[inversion ? 'items-end' : 'items-start']">
      <p
        v-if="isDate"
        class="text-xs text-[#c7c7c7] mb-1"
        :class="[inversion ? 'text-right' : 'text-left']"
      >
        {{ dayjs(startTime).format("YYYY/MM/DD HH:mm:ss") }}
      </p>
      <div class="flex items-end gap-1" :class="[inversion ? 'flex-row-reverse' : 'flex-row']">
        <Text
          ref="textRef"
          :inversion="inversion"
          :error="error"
          :text="text"
          :loading="loading"
          :as-raw-text="asRawText"
        />
        <!-- <div class="flex flex-col"></div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import Avatar from "./Avatar.vue";
import Text from "./Text.vue";

interface Props {
  startTime?: string;
  text: string;
  inversion?: boolean;
  error?: boolean;
  loading?: boolean;
  isDate?: boolean;
}

defineOptions({
  name: "Message",
});
defineProps<Props>();

const asRawText = ref(false);
</script>
