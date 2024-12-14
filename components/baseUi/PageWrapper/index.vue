<template>
  <div class="page_header_wrapper flex h-full flex-col">
    <div class="page-header">
      <div v-if="isShowBack" class="back" @click="navigation(backUrl)">
        <span class="iconfont icon-fanhui_icon icon" />
        Back
      </div>
      <el-divider v-if="isShowBack" direction="vertical" />
      <h2 v-if="title" class="title">{{ title }}</h2>
    </div>
    <div class="con flex flex-col flex-1 h-full overflow-auto">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "PageWrapper",
});

type Props = {
  title?: string;
  isShowBack?: boolean;
  backUrl?: string;
};
withDefaults(defineProps<Props>(), {
  isShowBack: false,
});

const router = useRouter();

function navigation(path?: string) {
  path ? router.push(path) : router.back();
}
</script>

<style scoped lang="less">
.page_header_wrapper {
  overflow: auto;
  .page-header {
    padding: 0 12px;
    height: 45px;
    .back {
      display: inline-block;
      line-height: 45px;
      cursor: pointer;
      vertical-align: middle;
      .icon {
        vertical-align: middle;
      }
    }
    .title {
      display: inline-block;
      line-height: 45px;
      margin: 0;
      font-size: 20px;
      vertical-align: middle;
    }
  }
  .con {
    padding: 12px;
  }
}
</style>
