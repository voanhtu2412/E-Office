<template>
  <div class="notification-module">
    <!-- Top level Stats Dashboard -->
    <NotificationStats :stats="globalStats" />

    <!-- Two Column Main Layout -->
    <div class="notification-module__content-grid">
      <!-- Main Content Area (Filters + List + Pagination) -->
      <main class="notification-module__main">
        <!-- Filter bar -->
        <NotificationFilters
          v-model:searchQuery="filters.searchQuery"
          v-model:selectedType="filters.selectedType"
          v-model:selectedDept="filters.selectedDept"
          v-model:selectedStatus="filters.selectedStatus"
          v-model:activeTab="filters.activeTab"
          @reset-filters="resetAllFilters"
          @settings-click="openSettings"
        />

        <!-- Notification List Table -->
        <NotificationTable
          :notifications="paginatedNotifications"
          @action-click="handleRowAction"
        />

        <!-- Pagination Controls -->
        <BasePagination
          v-model:currentPage="pagination.currentPage"
          v-model:itemsPerPage="pagination.itemsPerPage"
          :total-items="filteredNotifications.length"
        />
      </main>

      <!-- Sidebar Area (Quick Filters + Priorities + Support) -->
      <aside class="notification-module__sidebar">
        <!-- Quick filter categories count -->
        <QuickFilters
          :counts="categoryCounts"
          :active-type="filters.selectedType"
          @select-category="handleCategorySelect"
        />

        <!-- High priority warning list -->
        <PriorityList
          :items="priorityNotifications"
          @view-all="viewAllPriority"
        />

        <!-- Help desk Support form request -->
        <SupportBox
          @support-request="openSupportModal"
        />
      </aside>
    </div>
  </div>
</template>

<script>
// Base UI Components
import BasePagination from '@/components/BasePagination.vue';

// Module Components
import NotificationStats from './components/NotificationStats.vue';
import NotificationFilters from './components/NotificationFilters.vue';
import NotificationTable from './components/NotificationTable.vue';
import QuickFilters from './components/QuickFilters.vue';
import PriorityList from './components/PriorityList.vue';
import SupportBox from './components/SupportBox.vue';

// Constants and Data
import { MOCK_NOTIFICATIONS, PRIORITY_NOTIFICATIONS } from './mockData';

export default {
  name: 'NotificationModule',
  components: {
    BasePagination,
    NotificationStats,
    NotificationFilters,
    NotificationTable,
    QuickFilters,
    PriorityList,
    SupportBox
  },
  data() {
    return {
      allNotifications: MOCK_NOTIFICATIONS,
      priorityNotifications: PRIORITY_NOTIFICATIONS,
      filters: {
        searchQuery: '',
        selectedType: '',
        selectedDept: '',
        selectedStatus: '',
        activeTab: 'all'
      },
      pagination: {
        currentPage: 1,
        itemsPerPage: 8
      }
    };
  },
  watch: {
    // Reset to page 1 whenever any filter condition changes
    filters: {
      handler() {
        this.pagination.currentPage = 1;
      },
      deep: true
    }
  },
  computed: {
    // Top Stats calculated dynamically from full dataset
    globalStats() {
      const all = this.allNotifications;
      const unreadCount = all.filter(n => !n.isRead).length;
      
      return {
        total: all.length,
        unread: unreadCount,
        today: 8, // Set standard matching the mockup
        upcoming: 5, // Set standard matching the mockup
        read: all.length - unreadCount
      };
    },

    // Category count mappings for Quick Filters widget
    categoryCounts() {
      const counts = {
        '': this.allNotifications.length // All
      };
      
      this.allNotifications.forEach(n => {
        if (!counts[n.type]) {
          counts[n.type] = 0;
        }
        counts[n.type]++;
      });
      
      return counts;
    },

    // Dynamic filtering pipeline
    filteredNotifications() {
      return this.allNotifications.filter(item => {
        // 1. Filter by Active Tab
        if (this.filters.activeTab === 'unread' && item.isRead) {
          return false;
        }
        if (this.filters.activeTab === 'priority' && !['rule', 'system'].includes(item.type)) {
          // Rule & System categorised as priority in our demo
          return false;
        }
        if (this.filters.activeTab === 'mine' && item.sender !== 'Phòng CNTT') {
          // Assume user is in IT Department for demo
          return false;
        }

        // 2. Filter by Search Query (title, summary, sender)
        if (this.filters.searchQuery.trim()) {
          const query = this.filters.searchQuery.toLowerCase().trim();
          const matchesTitle = item.title.toLowerCase().includes(query);
          const matchesSummary = item.summary.toLowerCase().includes(query);
          const matchesSender = item.sender.toLowerCase().includes(query);
          
          if (!matchesTitle && !matchesSummary && !matchesSender) {
            return false;
          }
        }

        // 3. Filter by Notification Type dropdown
        if (this.filters.selectedType && item.type !== this.filters.selectedType) {
          return false;
        }

        // 4. Filter by Department dropdown
        if (this.filters.selectedDept && item.sender !== this.filters.selectedDept) {
          return false;
        }

        // 5. Filter by Read/Unread Status dropdown
        if (this.filters.selectedStatus) {
          const checkRead = this.filters.selectedStatus === 'read';
          if (item.isRead !== checkRead) {
            return false;
          }
        }

        return true;
      });
    },

    // Slice notifications list for pagination
    paginatedNotifications() {
      const start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
      const end = start + this.pagination.itemsPerPage;
      return this.filteredNotifications.slice(start, end);
    }
  },
  methods: {
    handleCategorySelect(type) {
      this.filters.selectedType = type;
      // Also reset tab when filtering by specific category
      if (this.filters.activeTab !== 'all') {
        this.filters.activeTab = 'all';
      }
    },
    resetAllFilters() {
      this.filters.searchQuery = '';
      this.filters.selectedType = '';
      this.filters.selectedDept = '';
      this.filters.selectedStatus = '';
      this.filters.activeTab = 'all';
      this.pagination.currentPage = 1;
    },
    handleRowAction(item) {
      alert(`Đang thực hiện thao tác với thông báo: \n"${item.title}"`);
    },
    openSettings() {
      alert('Mở cửa sổ Cài đặt cấu hình thông báo hệ thống.');
    },
    viewAllPriority() {
      this.filters.activeTab = 'priority';
      this.filters.selectedType = '';
    },
    openSupportModal() {
      alert('Đã tạo liên kết hỗ trợ. Bộ phận Hành chính - Quản trị sẽ phản hồi qua email của bạn trong ít phút!');
    }
  }
}
</script>

<style lang="scss">
.notification-module {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  gap: 16px;
  background-color: transparent;

  @include tablet {
    height: auto;
    max-height: none;
    overflow: auto;
    padding: $spacing-md;
  }

  &__content-grid {
    display: grid;
    grid-template-columns: 3.2fr 1fr; // Left is wider, Right is sidebar
    gap: $spacing-md;
    flex-grow: 1;
    min-height: 0; // critical: lets children shrink
    overflow: hidden;

    @include desktop {
      grid-template-columns: 1fr; // Stack columns on smaller screen widths
    }

    @include tablet {
      height: auto;
      overflow: visible;
    }
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    background-color: $color-white;
    border-radius: $border-radius-lg;
    padding: $spacing-md;
    box-shadow: $shadow-sm;
    border: 1px solid $color-border;
    min-width: 0; // Fix grid item overflow issues
    height: 100%;
    min-height: 0; // critical: lets child components shrink
    overflow: hidden;

    @include tablet {
      height: auto;
      min-height: auto;
      overflow: visible;
    }
  }

  &__sidebar {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    height: 100%;
    min-height: 0; // Fixes overflow within CSS grid
    overflow-y: auto; // Enables scroll inside the sidebar itself
    padding-right: 4px;
    padding-bottom: 16px; // Space at the bottom so it's not cut off abruptly
    @include custom-scrollbar(4px);

    > * {
      flex-shrink: 0; // Prevents cards from squishing, forces scrollbar instead
    }

    @include tablet {
      height: auto;
      overflow: visible;
      padding-right: 0;
    }
  }
}
</style>
