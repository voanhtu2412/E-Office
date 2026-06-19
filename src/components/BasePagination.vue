<template>
  <div class="base-pagination">
    <!-- Left: Status Info -->
    <div class="base-pagination__info">
      Hiển thị {{ startItem }} - {{ endItem }} trên {{ totalItems }} thông báo
    </div>

    <!-- Center: Page Controls -->
    <div class="base-pagination__controls">
      <button
        class="base-pagination__btn"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
        aria-label="Previous Page"
      >
        <svg width="7" height="12" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 9L1 5L5 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <template v-for="(page, idx) in pages" :key="idx">
        <span
          v-if="page === '...'"
          class="base-pagination__ellipsis"
        >
          ...
        </span>
        <button
          v-else
          :class="[
            'base-pagination__page-btn',
            { 'base-pagination__page-btn--active': currentPage === page }
          ]"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </template>

      <button
        class="base-pagination__btn"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
        aria-label="Next Page"
      >
        <svg width="7" height="12" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 9L5 5L1 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Right: Page Size Selector -->
    <div class="base-pagination__size">
      <div class="base-pagination__select-wrapper">
        <select
          :value="itemsPerPage"
          @change="onSizeChange($event.target.value)"
          class="base-pagination__select"
        >
          <option v-for="size in sizeOptions" :key="size" :value="size">
            {{ size }} / trang
          </option>
        </select>
        <span class="base-pagination__select-icon">
          <svg width="12" height="7" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasePagination',
  props: {
    totalItems: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      default: 8
    },
    currentPage: {
      type: Number,
      default: 1
    },
    sizeOptions: {
      type: Array,
      default: () => [8, 10, 20, 50]
    }
  },
  emits: ['update:currentPage', 'update:itemsPerPage'],
  computed: {
    totalPages() {
      return Math.max(1, Math.ceil(this.totalItems / this.itemsPerPage));
    },
    startItem() {
      if (this.totalItems === 0) return 0;
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    endItem() {
      return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    },
    pages() {
      const total = this.totalPages;
      const current = this.currentPage;
      const pages = [];

      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);

        if (current > 3) {
          pages.push('...');
        }

        const start = Math.max(2, current - 1);
        const end = Math.min(total - 1, current + 1);

        for (let i = start; i <= end; i++) {
          pages.push(i);
        }

        if (current < total - 2) {
          pages.push('...');
        }

        pages.push(total);
      }

      return pages;
    }
  },
  methods: {
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.$emit('update:currentPage', page);
      }
    },
    onSizeChange(size) {
      this.$emit('update:itemsPerPage', Number(size));
      this.$emit('update:currentPage', 1); // Reset to page 1 on size change
    }
  }
}
</script>

<style lang="scss">
.base-pagination {
  @include flex-between;
  flex-wrap: wrap;
  gap: $spacing-md;
  padding: $spacing-md 0;
  border-top: 1px solid $color-border-light;
  color: $color-text-muted;
  font-size: $font-size-sm;

  @include tablet {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  &__info {
    font-weight: $font-weight-regular;
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: $spacing-xs;

    @include mobile {
      gap: 2px;
    }
  }

  &__btn {
    @include flex-center;
    width: 32px;
    height: 32px;
    border-radius: $border-radius-md;
    border: 1px solid $color-border;
    color: $color-text-muted;
    background-color: $color-white;
    @include transition-smooth(background-color, color, border-color);

    &:hover:not(:disabled) {
      color: $color-primary;
      border-color: $color-primary;
      background-color: $color-primary-light;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    @include mobile {
      width: 28px;
      height: 28px;
    }
  }

  &__ellipsis {
    width: 32px;
    height: 32px;
    @include flex-center;
    color: $color-text-light;

    @include mobile {
      width: 28px;
      height: 28px;
    }
  }

  &__page-btn {
    width: 32px;
    height: 32px;
    @include flex-center;
    border-radius: $border-radius-md;
    font-weight: $font-weight-medium;
    background-color: transparent;
    border: 1px solid transparent;
    @include transition-smooth(background-color, color, border-color);

    &:hover {
      color: $color-primary;
      background-color: $color-primary-light;
    }

    &--active {
      background-color: $color-primary !important;
      color: $color-white !important;
      border-color: $color-primary;
    }

    @include mobile {
      width: 28px;
      height: 28px;
    }
  }

  &__size {
    display: flex;
    align-items: center;
  }

  &__select-wrapper {
    position: relative;
    display: inline-block;
  }

  &__select {
    padding: 6px 30px 6px 12px;
    font-size: $font-size-sm;
    color: $color-text-muted;
    background-color: $color-white;
    border: 1px solid $color-border;
    border-radius: $border-radius-md;
    cursor: pointer;
    appearance: none;
    outline: none;
    @include transition-smooth(border-color, box-shadow);

    &:focus {
      border-color: $color-primary;
    }
  }

  &__select-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    display: flex;
  }
}
</style>
