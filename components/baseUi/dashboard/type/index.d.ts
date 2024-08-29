import { Link } from "#ui/types";

export interface DashboardSidebarLink extends Link {
  labelClass?: string;
  icon?: string;
  iconClass?: string;
  avatar?: Avatar;
  avatarClass?: string;
  chip?: string | Chip;
  chipClass?: string;
  badge?: string | number | Badge;
  tooltip?: Tooltip;
  defaultOpen?: boolean;
  // Only applicable to links with children
  draggable?: boolean;
  collapsible?: boolean;
  children?: DashboardSidebarLink[];
  label: string;
  class?: string;
  click?: (...args: any[]) => void;
}
