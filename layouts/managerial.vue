<template>
  <div class="flex h-full">
    <DashboardPanel :width="250" :resizable="{ min: 200, max: 300 }" collapsible>
      <div class="p-4 overflow-y-auto">
        <DashboardSidebarLinks :links="links" />
      </div>
    </DashboardPanel>
    <div class="flex-1">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import DashboardSidebarLinks from "@/components/baseUi/dashboard/DashboardSidebarLinks.vue";
import type { DashboardSidebarLink } from "~/components/baseUi/dashboard/type";

const { t } = useI18n();
const links: DashboardSidebarLink[] = [
  {
    label: t("layout.repository"),
    icon: "i-iconoir-book",
    to: "/Managerial/knowledgeBase",
  },
];
</script>

<style></style>
