<template>
  <div class="eoffice-layout">
    <!-- Sidebar Toggle Overlay for Mobile -->
    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="sidebar-overlay"
        @click="sidebarOpen = false"
      ></div>
    </Transition>

    <!-- Left Sidebar -->
    <aside class="eoffice-sidebar" :class="{ 'sidebar-open': sidebarOpen, 'panel-open': activeModuleKey }">
      <!-- Logo Area -->
      <div class="logo-area">
        <div class="logo-icon-wrapper">
          <i class="fa-solid fa-cube logo-icon-hex"></i>
        </div>
        <div class="logo-text">
          <span class="brand">OSPACE</span>
          <span class="sub-brand">eOffice Platform</span>
        </div>
      </div>

      <!-- Icon rail and contextual module panel -->
      <div class="sidebar-shell">
        <nav class="icon-rail" aria-label="Main modules">
          <button
            v-for="module in sidebarModules"
            :key="module.key"
            class="rail-btn"
            type="button"
            :class="{ active: activeModuleKey === module.key }"
            :title="module.title"
            :aria-label="module.title"
            @click="selectModule(module.key)"
          >
            <i :class="module.icon"></i>
            <span v-if="module.badge" class="rail-badge">{{ module.badge }}</span>
          </button>

          <div class="rail-quick-access" aria-label="Truy cập nhanh">
            <button type="button" class="rail-quick-btn" title="Web Portal" aria-label="Web Portal">
              <i class="fa-solid fa-globe"></i>
            </button>
            <button type="button" class="rail-quick-btn" title="Mobile App" aria-label="Mobile App">
              <i class="fa-solid fa-mobile-screen-button"></i>
            </button>
            <button type="button" class="rail-quick-btn" :title="$t('i18nDashboard.dashboard.support')" :aria-label="$t('i18nDashboard.dashboard.support')">
              <i class="fa-solid fa-headset"></i>
            </button>
          </div>
        </nav>

        <Transition name="module-panel">
          <section v-if="activeModule" :key="activeModuleKey || 'none'" class="module-panel">
            <div class="module-panel-header">
              <h2>{{ activeModule.title }}</h2>
              <button type="button" aria-label="Đóng menu chức năng" @click="closeModulePanel">
                <i class="fa-solid fa-chevron-left"></i>
              </button>
            </div>

            <div class="module-actions">
              <div
                v-for="item in activeModule.items"
                :key="item.label"
                class="module-action-group"
                :class="{ expanded: expandedActionKey === item.label }"
              >
                <button
                  type="button"
                  class="module-action"
                  @click="toggleModuleAction(item.label)"
                >
                  <span class="module-action-left">
                    <i :class="item.icon"></i>
                    {{ item.label }}
                  </span>
                  <i class="fa-solid fa-chevron-down action-chevron"></i>
                </button>
                <Transition name="subactions">
                  <div v-if="expandedActionKey === item.label" class="module-subactions">
                    <button
                      v-for="subItem in item.children"
                      :key="getLabel(subItem)"
                      type="button"
                      class="module-subaction"
                      :class="{ 'active': getPath(subItem) && route.path === getPath(subItem) }"
                      @click="handleSubActionClick(subItem)"
                    >
                      <span class="subaction-dot"></span>
                      <span class="subaction-text">{{ getLabel(subItem) }}</span>
                    </button>
                  </div>
                </Transition>
              </div>
            </div>
          </section>
        </Transition>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="eoffice-main" :class="{ 'sidebar-panel-open': activeModuleKey }">
      <!-- Top Header -->
      <header class="eoffice-header">
        <div class="header-left">
          <button
            class="sidebar-toggle-btn"
            type="button"
            :aria-label="$t('i18nCommon.header.open_menu')"
            @click="sidebarOpen = true"
          >
            <i class="fa-solid fa-bars"></i>
          </button>
          <div class="welcome-box">
            <h1>{{ pageTitle }}</h1>
            <p v-if="isDashboardRoute" class="current-date">{{ locale === 'vi' ? 'Chủ nhật, 14 tháng 4 năm 2024 • 09:41 AM' : 'Sunday, April 14, 2024 • 09:41 AM' }}</p>
            <p v-else-if="pageSubtitle" class="page-subtitle">{{ pageSubtitle }}</p>
          </div>
        </div>

        <div class="header-right">
          <!-- Search box -->
          <div class="search-box">
            <input type="text" :placeholder="$t('i18nDashboard.dashboard.search_placeholder')" />
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
          </div>

          <!-- Quick Icons -->
          <div class="action-icons">
            <div class="icon-wrapper badge-active" role="button" tabindex="0" :title="$t('i18nCommon.header.notifications')" :aria-label="$t('i18nCommon.header.notifications')" @click="$router.push('/notifications')">
              <i class="fa-regular fa-bell"></i>
              <span class="header-badge">8</span>
            </div>
            <div class="icon-wrapper" role="button" tabindex="0" :title="$t('i18nCommon.header.messages')" :aria-label="$t('i18nCommon.header.messages')">
              <i class="fa-regular fa-comment-dots"></i>
            </div>
            <div class="icon-wrapper" role="button" tabindex="0" :title="$t('i18nCommon.header.help')" :aria-label="$t('i18nCommon.header.help')">
              <i class="fa-regular fa-circle-question"></i>
            </div>
          </div>

          <!-- User Avatar -->
          <div ref="profileMenuRef" class="profile-menu">
            <button
              class="header-avatar"
              type="button"
              :aria-expanded="profileOpen"
              aria-haspopup="menu"
              :title="$t('i18nCommon.header.account')"
              @click="toggleProfileMenu"
            >
              <img :src="imageAvatar" alt="Avatar" />
              <span class="online-dot"></span>
            </button>

            <Transition name="profile-dropdown">
              <div v-if="profileOpen" class="profile-dropdown" role="menu">
              <div class="profile-summary">
                <img :src="imageAvatar" alt="Avatar" />
                <div class="profile-meta">
                  <strong>Nguyễn Văn An</strong>
                  <span>{{ $t('i18nDashboard.dashboard.it_manager') }}</span>
                  <small>an.nguyen@ospace.vn</small>
                </div>
              </div>

              <div class="profile-section">
                <div class="section-title">{{ $t('i18nCommon.profile.language') }}</div>
                <div class="language-options">
                  <button
                    type="button"
                    class="language-btn"
                    :class="{ active: locale === 'vi' }"
                    @click="changeLanguage('vi')"
                  >
                    <span>VI</span>
                    Tiếng Việt
                  </button>
                  <button
                    type="button"
                    class="language-btn"
                    :class="{ active: locale === 'en' }"
                    @click="changeLanguage('en')"
                  >
                    <span>EN</span>
                    English
                  </button>
                </div>
              </div>

              <div class="profile-section">
                <div class="section-title">{{ $t('i18nCommon.profile.theme') }}</div>
                <div class="theme-options">
                  <button
                    type="button"
                    class="theme-btn"
                    :class="{ active: currentTheme === 'light' }"
                    @click="setTheme('light')"
                  >
                    <i class="fa-regular fa-sun"></i>
                    {{ $t('i18nCommon.profile.theme_light') }}
                  </button>
                  <button
                    type="button"
                    class="theme-btn"
                    :class="{ active: currentTheme === 'dark' }"
                    @click="setTheme('dark')"
                  >
                    <i class="fa-regular fa-moon"></i>
                    {{ $t('i18nCommon.profile.theme_dark') }}
                  </button>
                </div>
              </div>

              <div class="profile-section">
                <div class="section-title">{{ $t('i18nCommon.profile.ai_assistant') }}</div>
                <div class="theme-options">
                  <button
                    type="button"
                    class="theme-btn"
                    :class="{ active: !isAiHidden }"
                    @click="setAiHidden(false)"
                  >
                    <i class="fa-solid fa-eye"></i>
                    {{ $t('i18nCommon.profile.show_ai_chat') }}
                  </button>
                  <button
                    type="button"
                    class="theme-btn"
                    :class="{ active: isAiHidden }"
                    @click="setAiHidden(true)"
                  >
                    <i class="fa-solid fa-eye-slash"></i>
                    {{ $t('i18nCommon.profile.hide_ai_chat') }}
                  </button>
                </div>
              </div>

              <div class="profile-actions">
                <button type="button" role="menuitem">
                  <i class="fa-regular fa-user"></i>
                  {{ $t('i18nCommon.profile.account_profile') }}
                </button>
                <button type="button" role="menuitem">
                  <i class="fa-solid fa-shield-halved"></i>
                  {{ $t('i18nCommon.profile.security') }}
                </button>
                <button type="button" role="menuitem">
                  <i class="fa-solid fa-gear"></i>
                  {{ $t('i18nCommon.profile.settings') }}
                </button>
                <button type="button" class="logout-action" role="menuitem">
                  <i class="fa-solid fa-arrow-right-from-bracket"></i>
                  {{ $t('i18nCommon.profile.logout') }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
      </header>

      <!-- Sub Page Router View -->
      <router-view></router-view>
    </main>

    <!-- AI Chat Bubble -->
    <AiChatBubble />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import imageAvatar from '@/assets/image/imageAvatar.png';
import AiChatBubble from '@/components/AiChatBubble.vue';
import { isAiHidden, setAiHidden } from '@/utils/aiState';

const route = useRoute();
const router = useRouter();
const { locale, t } = useI18n();

const getLabel = (subItem: any): string => typeof subItem === 'string' ? subItem : subItem.label;
const getPath = (subItem: any): string | undefined => typeof subItem === 'string' ? undefined : subItem.path;

const isDashboardRoute = computed(() => route.path === '/dashboard' || route.name === 'Dashboard');

const pageTitle = computed(() => {
  if (isDashboardRoute.value) {
    return `${t('i18nDashboard.dashboard.hello')}, Nguyễn Văn An 👋`;
  }
  if (route.name === 'Notifications') {
    return t('i18nCommon.header.notifications');
  }
  return (route.meta?.title as string) || (route.name as string) || 'OSPACE';
});

const pageSubtitle = computed(() => {
  return (route.meta?.description as string) || '';
});
const sidebarOpen = ref(false);
const activeModuleKey = ref<string | null>(null);
const expandedActionKey = ref<string | null>(null);
const profileOpen = ref(false);
const profileMenuRef = ref<HTMLElement | null>(null);
const sidebarStateStorageKey = 'eoffice-sidebar-state';

const currentTheme = ref<'light' | 'dark'>('light');
const themeStorageKey = 'eoffice-theme';

const setTheme = (theme: 'light' | 'dark') => {
  currentTheme.value = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(themeStorageKey, theme);
};

const initTheme = () => {
  const savedTheme = localStorage.getItem(themeStorageKey) as 'light' | 'dark' | null;
  if (savedTheme === 'light' || savedTheme === 'dark') {
    setTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }
};

const sidebarModules = computed(() => [
  {
    key: 'dashboard',
    title: t('i18nDashboard.dashboard.dashboard'),
    icon: 'fa-solid fa-house',
    items: [
      {
        label: t('i18nDashboard.dashboard.overview'),
        icon: 'fa-solid fa-chart-pie',
        children: [
          { label: t('i18nDashboard.dashboard.submenu_children.personal_dashboard'), path: '/dashboard' },
          t('i18nDashboard.dashboard.submenu_children.by_dept'),
          t('i18nDashboard.dashboard.submenu_children.by_week')
        ]
      },
      {
        label: t('i18nDashboard.dashboard.quick_statistics'),
        icon: 'fa-solid fa-gauge-high',
        children: [
          t('i18nDashboard.dashboard.submenu_children.archived_docs'),
          t('i18nDashboard.dashboard.submenu_children.online_users'),
          t('i18nDashboard.dashboard.submenu_children.used_capacity')
        ]
      },
      {
        label: t('i18nDashboard.dashboard.today_schedule'),
        icon: 'fa-solid fa-calendar-day',
        children: [
          t('i18nDashboard.dashboard.submenu_children.today_schedule'),
          t('i18nDashboard.dashboard.submenu_children.create_schedule'),
          t('i18nDashboard.dashboard.submenu_children.book_room')
        ]
      },
    ],
  },
  {
    key: 'work',
    title: t('i18nDashboard.dashboard.my_work'),
    icon: 'fa-solid fa-list-check',
    badge: 12,
    items: [
      {
        label: t('i18nDashboard.dashboard.my_work'),
        icon: 'fa-solid fa-briefcase',
        children: [
          t('i18nDashboard.dashboard.submenu_children.work_in_progress'),
          t('i18nDashboard.dashboard.submenu_children.work_overdue'),
          t('i18nDashboard.dashboard.submenu_children.work_completed')
        ]
      },
      {
        label: t('i18nDashboard.dashboard.tasks_to_handle'),
        icon: 'fa-solid fa-inbox',
        children: [
          t('i18nDashboard.dashboard.submenu_children.handle_today'),
          t('i18nDashboard.dashboard.submenu_children.assigned_to_me'),
          t('i18nDashboard.dashboard.submenu_children.assigned_by_me')
        ]
      },
      {
        label: t('i18nDashboard.dashboard.view_details'),
        icon: 'fa-solid fa-eye',
        children: [
          t('i18nDashboard.dashboard.submenu_children.task_details'),
          t('i18nDashboard.dashboard.submenu_children.process_history'),
          t('i18nDashboard.dashboard.submenu_children.attachments')
        ]
      },
    ],
  },
  {
    key: 'docs',
    title: t('i18nDashboard.dashboard.docs_docs'),
    icon: 'fa-solid fa-folder-open',
    items: [
      {
        label: t('i18nDashboard.dashboard.submenu.docs_incoming'),
        icon: 'fa-solid fa-file-import',
        children: [
          t('i18nDashboard.dashboard.submenu_children.pending_action'),
          t('i18nDashboard.dashboard.submenu_children.received'),
          t('i18nDashboard.dashboard.submenu_children.urgent_docs')
        ]
      },
      {
        label: t('i18nDashboard.dashboard.submenu.docs_outgoing'),
        icon: 'fa-solid fa-file-export',
        children: [
          t('i18nDashboard.dashboard.submenu_children.create_doc'),
          t('i18nDashboard.dashboard.submenu_children.pending_sig'),
          t('i18nDashboard.dashboard.submenu_children.issued')
        ]
      },
      {
        label: t('i18nDashboard.dashboard.submenu.docs_archive'),
        icon: 'fa-solid fa-box-archive',
        children: [
          t('i18nDashboard.dashboard.submenu_children.search_files'),
          t('i18nDashboard.dashboard.submenu_children.repository'),
          t('i18nDashboard.dashboard.submenu_children.doc_classification')
        ]
      },
    ],
  },
  {
    key: 'process',
    title: t('i18nDashboard.dashboard.process_approval'),
    icon: 'fa-solid fa-network-wired',
    items: [
      {
        label: t('i18nDashboard.dashboard.submenu.process_my_requests'),
        icon: 'fa-solid fa-paper-plane',
        children: [
          t('i18nDashboard.dashboard.submenu_children.create_request'),
          t('i18nDashboard.dashboard.submenu_children.pending_approval'),
          t('i18nDashboard.dashboard.submenu_children.completed')
        ]
      },
      {
        label: t('i18nDashboard.dashboard.submenu.process_pending'),
        icon: 'fa-solid fa-user-check',
        children: [
          t('i18nDashboard.dashboard.submenu_children.quick_approve'),
          t('i18nDashboard.dashboard.submenu_children.forward'),
          t('i18nDashboard.dashboard.submenu_children.reject')
        ]
      },
      {
        label: t('i18nDashboard.dashboard.submenu.process_templates'),
        icon: 'fa-solid fa-diagram-project',
        children: [
          t('i18nDashboard.dashboard.submenu_children.procurement_template'),
          t('i18nDashboard.dashboard.submenu_children.leave_template'),
          t('i18nDashboard.dashboard.submenu_children.payment_template')
        ]
      },
    ],
  },
  {
    key: 'calendar',
    title: t('i18nDashboard.dashboard.calendar_meetings'),
    icon: 'fa-solid fa-calendar-days',
    items: [
      {
        label: t('i18nDashboard.dashboard.submenu.cal_personal'),
        icon: 'fa-solid fa-calendar-check',
        children: [
          t('i18nDashboard.dashboard.submenu_children.daily_calendar'),
          t('i18nDashboard.dashboard.submenu_children.weekly_calendar'),
          t('i18nDashboard.dashboard.submenu_children.task_reminder')
        ]
      },
      {
        label: t('i18nDashboard.dashboard.submenu.cal_dept'),
        icon: 'fa-solid fa-building-user',
        children: [
          t('i18nDashboard.dashboard.submenu_children.dept_calendar'),
          t('i18nDashboard.dashboard.submenu_children.duty_roster'),
          t('i18nDashboard.dashboard.submenu_children.common_events')
        ]
      },
      {
        label: t('i18nDashboard.dashboard.submenu.cal_rooms'),
        icon: 'fa-solid fa-door-open',
        children: [
          { label: t('i18nDashboard.dashboard.submenu_children.available_rooms'), path: '/meeting' },
          t('i18nDashboard.dashboard.submenu_children.book_a_room'),
          t('i18nDashboard.dashboard.submenu_children.booking_history')
        ]
      },
    ],
  },
  {
    key: 'assets',
    title: t('i18nDashboard.dashboard.assets_devices'),
    icon: 'fa-solid fa-laptop-house',
    items: [
      {
        label: t('i18nDashboard.dashboard.submenu.assets_list'),
        icon: 'fa-solid fa-laptop',
        children: [
          t('i18nDashboard.dashboard.submenu_children.devices_directory'),
          t('i18nDashboard.dashboard.submenu_children.allocated_assets'),
          t('i18nDashboard.dashboard.submenu_children.recalled_assets')
        ]
      },
      {
        label: t('i18nDashboard.dashboard.submenu.assets_request'),
        icon: 'fa-solid fa-cloud-arrow-up',
        children: [
          t('i18nDashboard.dashboard.submenu_children.new_request'),
          t('i18nDashboard.dashboard.submenu_children.pending_allocation'),
          t('i18nDashboard.dashboard.submenu_children.allocated')
        ]
      },
      {
        label: t('i18nDashboard.dashboard.submenu.assets_maintenance'),
        icon: 'fa-solid fa-screwdriver-wrench',
        children: [
          t('i18nDashboard.dashboard.submenu_children.report_breakdown'),
          t('i18nDashboard.dashboard.submenu_children.maintenance_schedule'),
          t('i18nDashboard.dashboard.submenu_children.repair_record')
        ]
      },
    ],
  },
  {
    key: 'reports',
    title: t('i18nDashboard.dashboard.reports_stats'),
    icon: 'fa-solid fa-chart-line',
    items: [
      {
        label: t('i18nDashboard.dashboard.submenu.reports_work'),
        icon: 'fa-solid fa-chart-simple',
        children: [
          t('i18nDashboard.dashboard.submenu_children.daily_report'),
          t('i18nDashboard.dashboard.submenu_children.weekly_report'),
          t('i18nDashboard.dashboard.submenu_children.monthly_report')
        ]
      },
      {
        label: t('i18nDashboard.dashboard.submenu.reports_performance'),
        icon: 'fa-solid fa-chart-column',
        children: [
          t('i18nDashboard.dashboard.submenu_children.by_individual'),
          t('i18nDashboard.dashboard.submenu_children.by_department'),
          t('i18nDashboard.dashboard.submenu_children.by_kpi')
        ]
      },
      {
        label: t('i18nDashboard.dashboard.submenu.reports_finance'),
        icon: 'fa-solid fa-coins',
        children: [
          t('i18nDashboard.dashboard.submenu_children.expenses'),
          t('i18nDashboard.dashboard.submenu_children.advance_payment'),
          t('i18nDashboard.dashboard.submenu_children.final_payment')
        ]
      },
    ],
  },
  {
    key: 'settings',
    title: t('i18nDashboard.dashboard.settings'),
    icon: 'fa-solid fa-gear',
    items: [
      {
        label: t('i18nDashboard.dashboard.settings'),
        icon: 'fa-solid fa-sliders',
        children: [
          t('i18nDashboard.dashboard.submenu_children.company_info'),
          t('i18nDashboard.dashboard.submenu_children.permissions'),
          t('i18nDashboard.dashboard.submenu_children.system_config')
        ]
      },
      {
        label: t('i18nDashboard.dashboard.support'),
        icon: 'fa-solid fa-headset',
        children: [
          t('i18nDashboard.dashboard.submenu_children.submit_request'),
          t('i18nDashboard.dashboard.submenu_children.user_guide'),
          t('i18nDashboard.dashboard.submenu_children.contact_support')
        ]
      },
      {
        label: t('i18nDashboard.dashboard.submenu.web_portal'),
        icon: 'fa-solid fa-globe',
        children: [
          t('i18nDashboard.dashboard.submenu_children.intranet'),
          t('i18nDashboard.dashboard.submenu_children.system_announcements'),
          t('i18nDashboard.dashboard.submenu_children.quick_links')
        ]
      },
    ],
  },
]);

const activeModule = computed(() => sidebarModules.value.find((module) => module.key === activeModuleKey.value) ?? null);

const restoreSidebarState = () => {
  const savedState = localStorage.getItem(sidebarStateStorageKey);
  if (!savedState) return;

  try {
    const parsedState = JSON.parse(savedState) as {
      activeModuleKey?: string | null;
      expandedActionKey?: string | null;
    };

    if (parsedState.activeModuleKey && sidebarModules.value.some((module) => module.key === parsedState.activeModuleKey)) {
      activeModuleKey.value = parsedState.activeModuleKey;
      expandedActionKey.value = parsedState.expandedActionKey ?? null;
    }
  } catch {
    localStorage.removeItem(sidebarStateStorageKey);
  }
};

watch([activeModuleKey, expandedActionKey], ([moduleKey, actionKey]) => {
  localStorage.setItem(sidebarStateStorageKey, JSON.stringify({
    activeModuleKey: moduleKey,
    expandedActionKey: actionKey,
  }));
});

const selectModule = (moduleKey: string) => {
  activeModuleKey.value = activeModuleKey.value === moduleKey ? null : moduleKey;
  expandedActionKey.value = null;
};

const closeModulePanel = () => {
  activeModuleKey.value = null;
  expandedActionKey.value = null;
};

const toggleModuleAction = (label: string) => {
  expandedActionKey.value = expandedActionKey.value === label ? null : label;
};

const handleSubActionClick = (subItem: any) => {
  if (subItem.path) {
    router.push(subItem.path);
    if (window.innerWidth <= 1024) {
      sidebarOpen.value = false;
    }
  }
};

const toggleProfileMenu = () => {
  profileOpen.value = !profileOpen.value;
};

const changeLanguage = (lang: 'vi' | 'en') => {
  locale.value = lang;
};

const handleClickOutside = (event: MouseEvent) => {
  if (!profileMenuRef.value?.contains(event.target as Node)) {
    profileOpen.value = false;
  }
};

const handleResize = () => {
  if (window.innerWidth > 1024) {
    sidebarOpen.value = false;
  }
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    sidebarOpen.value = false;
    activeModuleKey.value = null;
    expandedActionKey.value = null;
    profileOpen.value = false;
  }
};

onMounted(() => {
  initTheme();
  restoreSidebarState();
  window.addEventListener('resize', handleResize);
  window.addEventListener('keydown', handleEscape);
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('keydown', handleEscape);
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables.scss" as *;

.eoffice-layout {
  display: flex;
  height: 100vh;
  background-color: $bg-main;
  position: relative;
  overflow: hidden;
}

// Sidebar Style
.eoffice-sidebar {
  width: 78px;
  min-width: 78px;
  background-color: $bg-sidebar;
  display: flex;
  flex-direction: column;
  border-right: 0;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s ease, min-width 0.3s ease;
  overflow-x: hidden;

  // Staggered transitions for labels to prevent wrapping/glitches during collapse
  .logo-text,
  .nav-label,
  .badge,
  .submenu-chevron,
  .quick-item span {
    opacity: 1;
    visibility: visible;
    max-width: 180px; /* Safe upper bound */
    overflow: hidden;
    transition: opacity 0.25s ease 0.15s, max-width 0.3s ease, visibility 0.25s ease 0.15s;
  }

  .quick-title {
    opacity: 1;
    visibility: visible;
    max-height: 40px; /* Safe upper bound */
    overflow: hidden;
    transition: opacity 0.25s ease 0.15s, max-height 0.3s ease, visibility 0.25s ease 0.15s;
  }

  &.panel-open {
    @media (min-width: 1025px) {
      width: 288px;
      min-width: 288px;
    }
  }

  &.sidebar-collapsed {
    @media (min-width: 1025px) {
      width: 70px;
      min-width: 70px;

      .submenu-list {
        display: none !important;
      }

      .logo-text,
      .nav-label,
      .badge,
      .submenu-chevron,
      .quick-item span {
        opacity: 0 !important;
        visibility: hidden !important;
        max-width: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        transition: opacity 0.1s ease, max-width 0.3s ease, visibility 0.1s ease !important;
      }

      .quick-title {
        opacity: 0 !important;
        visibility: hidden !important;
        max-height: 0 !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        transition: opacity 0.1s ease, max-height 0.3s ease, visibility 0.1s ease !important;
      }

      .logo-area {
        padding: 24px 17px;
        justify-content: center;
        gap: 0 !important;
      }

      .sidebar-nav {
        padding: 16px 8px;
      }

      .nav-link {
        padding: 11px 0;
        justify-content: center;
      }

      .nav-icon {
        margin: 0;
      }

      .sidebar-footer {
        padding: 16px 4px !important;
      }

      .quick-grid {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
      }

      .quick-item {
        .quick-icon-btn {
          width: 34px !important;
          height: 34px !important;
        }
      }
    }
  }

  @media (max-width: 1024px) {
    width: 288px;
    min-width: 288px;
    transform: translateX(-100%);
    &.sidebar-open {
      transform: translateX(0);
    }
  }
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  backdrop-filter: blur(2px);
}

.logo-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  width: 78px;
  min-height: 72px;
  padding: 14px 17px;
  border-bottom: 1px solid rgba(10, 101, 255, 0.05);
  white-space: nowrap;
  overflow: hidden;
  transition: padding 0.3s ease;

  .logo-icon-wrapper {
    width: 42px;
    height: 42px;
    background: linear-gradient(135deg, #0a65ff 0%, #00d2ff 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(10, 101, 255, 0.25);
    
    .logo-icon-hex {
      color: #ffffff;
      font-size: 23px;
    }
  }

  .logo-text {
    display: none;
  }
}

.sidebar-shell {
  display: flex;
  flex: 1;
  min-height: 0;
}

.icon-rail {
  width: 78px;
  min-width: 78px;
  padding: 10px 8px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0;
  }
}

.rail-quick-access {
  margin-top: auto;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rail-quick-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: $bg-white;
  border: 1px solid $border-light;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-medium;
  font-size: 19.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;

  &:hover,
  &:focus-visible {
    color: $primary-color;
    border-color: rgba(10, 101, 255, 0.28);
    background-color: rgba(10, 101, 255, 0.04);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(10, 101, 255, 0.1);
    outline: none;
  }
}

.rail-btn {
  position: relative;
  width: 54px;
  height: 50px;
  border: 1px solid transparent;
  border-radius: 8px;
  background-color: transparent;
  color: #8a99ad;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25.3px;
  transition: all 0.2s ease;

  &:hover,
  &:focus-visible {
    background-color: rgba(10, 101, 255, 0.05);
    color: $primary-color;
    border-color: rgba(10, 101, 255, 0.08);
    outline: none;
  }

  &.active {
    background: linear-gradient(135deg, #0a65ff 0%, #0054d6 100%);
    color: #ffffff;
    border-color: transparent;
    box-shadow: 0 4px 12px rgba(10, 101, 255, 0.24);
  }

  .rail-badge {
    position: absolute;
    top: 5px;
    right: 5px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    border-radius: 999px;
    background-color: $danger-color;
    color: #ffffff;
    border: 2px solid #ffffff;
    font-size: 10.4px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.module-panel {
  position: absolute;
  top: 0;
  left: 78px;
  width: 210px;
  min-width: 210px;
  height: 100vh;
  padding: 16px;
  background-color: $bg-white;
  border-right: 1px solid $border-light;
  box-shadow: 8px 0 18px rgba(10, 101, 255, 0.04);
  overflow-y: auto;
  z-index: 3;
  will-change: transform, opacity;

  .module-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 14px;
    margin-bottom: 12px;
    border-bottom: 1px solid rgba(10, 101, 255, 0.08);

    h2 {
      margin: 0;
      color: $text-dark;
      font-size: 16.7px;
      font-weight: 800;
      text-transform: uppercase;
    }

    button {
      width: 34px;
      height: 34px;
      border: 0;
      border-radius: 8px;
      background-color: transparent;
      color: $text-medium;
      transition: all 0.2s ease;

      &:hover,
      &:focus-visible {
        background-color: rgba(10, 101, 255, 0.06);
        color: $primary-color;
        outline: none;
      }
    }
  }

  .module-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  .module-action-group {
    border-radius: 10px;
    width: 100%;

    &.expanded {
      .module-action {
        background-color: rgba(10, 101, 255, 0.08);
        color: $primary-color;
      }

      .action-chevron {
        transform: rotate(180deg);
      }
    }
  }

  .module-action {
    width: 100%;
    min-height: 54px;
    border: 0;
    border-radius: 8px;
    padding: 0 12px;
    background-color: $bg-light-gray;
    color: $text-medium;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    font-size: 16.7px;
    font-weight: 600;
    transition: all 0.2s ease;

    &:hover,
    &:focus-visible {
      background-color: rgba(10, 101, 255, 0.08);
      color: $primary-color;
      outline: none;
    }

    .module-action-left {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }

    i {
      flex-shrink: 0;
      font-size: 18.4px;
    }

    .action-chevron {
      color: $text-muted;
      font-size: 12.6px;
      transition: transform 0.2s ease;
    }
  }

  .module-subactions {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px 4px 2px 8px;
    overflow: hidden;
  }

  .module-subaction {
    width: 100%;
    min-height: 38px;
    border: 0;
    border-radius: 8px;
    padding: 0 10px;
    background-color: transparent;
    color: $text-dark;
    display: flex;
    align-items: center;
    gap: 8px;
    text-align: left;
    font-size: 15.5px;
    font-weight: 600;
    transition: all 0.2s ease;

    &:hover,
    &:focus-visible {
      background-color: rgba(10, 101, 255, 0.05);
      color: $primary-color;
      outline: none;
    }

    &.active {
      background-color: rgba(10, 101, 255, 0.08);
      color: $primary-color;
      font-weight: 700;
      
      .subaction-dot {
        background-color: $primary-color;
      }
    }

    .subaction-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: rgba(10, 101, 255, 0.35);
      flex-shrink: 0;
    }

    .subaction-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }
  }
}

.module-panel-enter-active,
.module-panel-leave-active {
  transition:
    opacity 0.28s ease,
    transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.module-panel-enter-from,
.module-panel-leave-to {
  opacity: 0;
  transform: translateX(-18px);
}

.module-panel-enter-to,
.module-panel-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.subactions-enter-active,
.subactions-leave-active {
  max-height: 400px;
  opacity: 1;
  transform: translateY(0);
  transition:
    max-height 0.35s ease-in-out,
    opacity 0.25s ease-in-out,
    transform 0.3s ease;
}

.subactions-enter-from,
.subactions-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-6px);
}

.subactions-enter-to,
.subactions-leave-from {
  max-height: 400px;
  opacity: 1;
  transform: translateY(0);
}

/*
  Legacy sidebar styles below are kept for components not yet migrated.
  The new icon rail above owns the visible sidebar UI.
*/

.logo-area {
  .logo-text {
    display: none;
    
    .brand {
      font-size: 18.4px;
      font-weight: 800;
      color: #0a65ff;
      letter-spacing: 0.5px;
      line-height: 1.2;
    }

    .sub-brand {
      font-size: 12.6px;
      color: $text-light;
      font-weight: 500;
    }
  }
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;

  .nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .nav-item {
    position: relative;

    .nav-link {
      display: flex;
      align-items: center;
      padding: 11px 16px;
      border-radius: 8px;
      text-decoration: none;
      color: $text-medium;
      font-size: 15.5px;
      font-weight: 500;
      transition: background-color 0.2s ease, color 0.2s ease, padding 0.3s ease, justify-content 0.3s ease;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      outline: none;

      &:hover,
      &:focus-visible {
        background-color: rgba(10, 101, 255, 0.04);
        color: $primary-color;
      }
    }

    .nav-icon {
      font-size: 18.4px;
      width: 24px;
      color: #8a99ad;
      transition: color 0.2s ease;
    }

    .nav-label {
      flex: 1;
    }

    .badge {
      font-size: 11.5px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 10px;
      margin-left: auto;
      
      &.badge-red {
        background-color: $danger-color;
        color: #ffffff;
      }
    }

    .submenu-chevron {
      font-size: 11.5px;
      color: $text-muted;
      margin-left: auto;
      transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      
      &.rotated {
        transform: rotate(180deg);
      }
    }

    .submenu-list {
      list-style: none;
      padding: 0 0 0 40px;
      margin: 0;
      max-height: 0;
      opacity: 0;
      overflow: hidden;
      transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease, padding 0.3s ease;

      &.expanded {
        max-height: 120px;
        opacity: 1;
        padding-top: 4px;
        padding-bottom: 8px;
      }

      li {
        margin-bottom: 2px;
        &:last-child {
          margin-bottom: 0;
        }
      }

      .submenu-link {
        display: block;
        padding: 6px 12px;
        font-size: 14.4px;
        color: $text-medium;
        text-decoration: none;
        border-radius: 6px;
        transition: all 0.2s ease;
        cursor: pointer;

        &:hover,
        &:focus-visible {
          background-color: rgba(10, 101, 255, 0.04);
          color: $primary-color;
        }
      }
    }

    &.active {
      .nav-link {
        background: linear-gradient(135deg, #0a65ff 0%, #0054d6 100%);
        color: #ffffff;
        box-shadow: 0 4px 12px rgba(10, 101, 255, 0.25);
        
        .nav-icon {
          color: #ffffff;
        }
      }
    }
  }
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(10, 101, 255, 0.05);
  background-color: $bg-card-light;

  .quick-access {
    margin-bottom: 20px;

    .quick-title {
      font-size: 12.6px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #8a99ad;
      font-weight: 700;
      margin-bottom: 12px;
      padding-left: 4px;
    }

    .quick-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      text-align: center;
    }

    .quick-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;

      .quick-icon-btn {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background-color: $bg-white;
        border: 1px solid $border-light;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $text-medium;
        font-size: 17.3px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
        transition: all 0.2s ease;

        &:hover {
          color: $primary-color;
          border-color: $primary-color;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(10, 101, 255, 0.1);
        }
      }

      span {
        font-size: 11.5px;
        color: $text-light;
        font-weight: 500;
      }
    }
  }


}

// Main Area Style
.eoffice-main {
  flex: 1;
  margin-left: 78px;
  padding: 18px;
  background-color: $bg-main;
  height: 100vh;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
  transition: margin-left 0.3s ease;

  &.sidebar-panel-open {
    @media (min-width: 1025px) {
      margin-left: 288px;
    }
  }

  @media (max-width: 1024px) {
    margin-left: 0;
    padding: 16px;
  }

  @media (max-width: 1300px) {
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
  }

  @media (max-width: 600px) {
    padding: 12px;
    gap: 14px;
  }
}

// Header Style
.eoffice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  border-bottom: 2px solid $border-light;
  padding-bottom: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .sidebar-toggle-btn {
      display: none;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 8px;
      background-color: $bg-white;
      border: 1px solid rgba(10, 101, 255, 0.08);
      color: $text-medium;
      font-size: 18.4px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.01);
      flex-shrink: 0;

      &:hover,
      &:focus-visible {
        background-color: rgba(10, 101, 255, 0.03);
        color: $primary-color;
        outline: none;
      }

      @media (max-width: 1024px) {
        display: flex;
      }
    }

    .welcome-box {
      min-width: 0;

      h1 {
        font-size: 23px;
        font-weight: 800;
        color: $text-dark;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .current-date {
        font-size: 13.8px;
        color: $text-light;
        margin: 4px 0 0 0;
        font-weight: 500;
      }

      @media (max-width: 600px) {
        h1 {
          font-size: 19.5px;
        }

        .current-date {
          font-size: 12.6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;

    @media (max-width: 768px) {
      justify-content: space-between;
      gap: 12px;
    }

    @media (max-width: 600px) {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 10px;
    }

    .search-box {
      position: relative;
      width: 220px;

      @media (max-width: 768px) {
        width: min(100%, 320px);
      }

      @media (max-width: 480px) {
        width: 100%;
      }

      input {
        width: 100%;
        padding: 8px 36px 8px 16px;
        border-radius: 20px;
        border: 1px solid $border-light;
        background-color: $bg-white;
        font-size: 15px;
        font-family: inherit;
        outline: none;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.01);

        &:focus {
          border-color: $primary-color;
          box-shadow: 0 4px 10px rgba(10, 101, 255, 0.08);
        }
      }

      .search-icon {
        position: absolute;
        top: 50%;
        right: 14px;
        transform: translateY(-50%);
        color: $text-muted;
        font-size: 15px;
        pointer-events: none;
      }
    }

    .action-icons {
      display: flex;
      align-items: center;
      gap: 12px;

      @media (max-width: 480px) {
        gap: 8px;

        .icon-wrapper:nth-child(3) {
          display: none;
        }
      }

      .icon-wrapper {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background-color: $bg-white;
        border: 1px solid rgba(10, 101, 255, 0.06);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18.4px;
        color: $text-medium;
        cursor: pointer;
        position: relative;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.01);

        &:hover,
        &:focus-visible {
          background-color: rgba(10, 101, 255, 0.03);
          color: $primary-color;
          transform: translateY(-1px);
          outline: none;
        }

        .header-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          min-width: 16px;
          height: 16px;
          background-color: $danger-color;
          color: #ffffff;
          font-size: 10.4px;
          font-weight: 700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
        }
      }
    }

    .profile-menu {
      position: relative;
      z-index: 30;
    }

    .header-avatar {
      position: relative;
      width: 38px;
      height: 38px;
      border: 0;
      border-radius: 50%;
      cursor: pointer;
      background: transparent;
      padding: 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

      &:hover,
      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 4px rgba(10, 101, 255, 0.12), 0 4px 12px rgba(10, 101, 255, 0.12);
      }

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }

      .online-dot {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 10px;
        height: 10px;
        background-color: $success-color;
        border: 2px solid #ffffff;
        border-radius: 50%;
      }
    }

    .profile-dropdown {
      position: absolute;
      top: calc(100% + 12px);
      right: 0;
      width: 292px;
      padding: 12px;
      border-radius: 14px;
      border: 1px solid rgba(10, 101, 255, 0.1);
      background-color: $bg-glass-dropdown;
      box-shadow: 0 18px 45px rgba(16, 24, 40, 0.12);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);

      &::before {
        content: "";
        position: absolute;
        top: -6px;
        right: 14px;
        width: 12px;
        height: 12px;
        background-color: $bg-glass-dropdown;
        border-left: 1px solid rgba(10, 101, 255, 0.1);
        border-top: 1px solid rgba(10, 101, 255, 0.1);
        transform: rotate(45deg);
      }

      @media (max-width: 480px) {
        position: fixed;
        top: 112px;
        right: 12px;
        left: 12px;
        width: auto;

        &::before {
          display: none;
        }
      }
    }

    .profile-summary {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px;
      border-radius: 12px;
      background-color: $bg-summary;

      img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
      }

      .profile-meta {
        display: flex;
        flex-direction: column;
        min-width: 0;

        strong {
          font-size: 16.1px;
          color: $text-dark;
          line-height: 1.2;
        }

        span,
        small {
          font-size: 13.2px;
          color: $text-light;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    .profile-section {
      padding: 12px 4px 8px;

      .section-title {
        margin-bottom: 8px;
        font-size: 12.6px;
        font-weight: 800;
        color: $text-muted;
        text-transform: uppercase;
      }
    }

    .language-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .language-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-height: 36px;
      border: 1px solid rgba(10, 101, 255, 0.08);
      border-radius: 10px;
      background-color: $bg-white;
      color: $text-medium;
      font-size: 13.8px;
      font-weight: 700;
      transition: all 0.2s ease;

      span {
        font-size: 11.5px;
        color: $primary-color;
      }

      &:hover,
      &:focus-visible,
      &.active {
        border-color: rgba(10, 101, 255, 0.28);
        background-color: rgba(10, 101, 255, 0.06);
        color: $primary-color;
        outline: none;
      }
    }

    .theme-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .theme-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 36px;
      border: 1px solid rgba(10, 101, 255, 0.08);
      border-radius: 10px;
      background-color: $bg-white;
      color: $text-medium;
      font-size: 13.8px;
      font-weight: 700;
      transition: all 0.2s ease;

      i {
        font-size: 15px;
        color: $text-light;
      }

      &:hover,
      &:focus-visible,
      &.active {
        border-color: rgba(10, 101, 255, 0.28);
        background-color: rgba(10, 101, 255, 0.06);
        color: $primary-color;
        outline: none;

        i {
          color: $primary-color;
        }
      }
    }

    .profile-actions {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding-top: 8px;
      border-top: 1px solid rgba(10, 101, 255, 0.08);

      button {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        min-height: 36px;
        padding: 8px 10px;
        border: 0;
        border-radius: 10px;
        background-color: transparent;
        color: $text-medium;
        font-size: 15px;
        font-weight: 600;
        text-align: left;
        transition: all 0.2s ease;

        i {
          width: 18px;
          color: $text-muted;
          text-align: center;
        }

        &:hover,
        &:focus-visible {
          background-color: rgba(10, 101, 255, 0.05);
          color: $primary-color;
          outline: none;

          i {
            color: $primary-color;
          }
        }

        &.logout-action {
          color: $danger-color;

          i {
            color: $danger-color;
          }

          &:hover,
          &:focus-visible {
            background-color: rgba(255, 59, 48, 0.06);
            color: $danger-color;
          }
        }
      }
    }
  }
}

// Profile dropdown transition
.profile-dropdown-enter-active,
.profile-dropdown-leave-active {
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;
}
.profile-dropdown-enter-from,
.profile-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
.profile-dropdown-enter-to,
.profile-dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

// Fade transition for mobile overlay
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
