<template>
  <ul class="dir-org-tree" :class="{'dir-org-tree--root': isRoot}">
    <li
      v-for="node in nodes"
      :key="node.id"
      class="dir-org-tree-node"
    >
      <!-- Node Card -->
      <div
        class="dir-org-node"
        :class="{
          'dir-org-node--company': node.type === 'company',
          'dir-org-node--department': node.type === 'department',
          'dir-org-node--selected': selectedId === node.id
        }"
        @click="$emit('select', node)"
      >
        <!-- Expand/collapse toggle -->
        <button
          v-if="node.children && node.children.length > 0"
          class="dir-org-node-toggle"
          :class="{ 'dir-org-node-toggle--expanded': isExpanded(node.id) }"
          type="button"
          :aria-label="isExpanded(node.id) ? 'Thu gọn' : 'Mở rộng'"
          @click.stop="$emit('toggle', node.id)"
        >
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
              d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div v-else class="dir-org-node-toggle-placeholder" />

        <!-- Node icon by type -->
        <div class="dir-org-node-icon-wrap">
          <svg v-if="node.type === 'company'" class="dir-org-node-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <svg v-else-if="node.type === 'department'" class="dir-org-node-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        <!-- Node label -->
        <div class="dir-org-node-info">
          <div class="dir-org-node-name">{{ node.name }}</div>
          <div class="dir-org-node-code">{{ node.code }}</div>
        </div>

        <!-- Member count badge -->
        <div v-if="node.members && node.members.length > 0" class="dir-org-node-member-count">
          {{ node.members.length }} người
        </div>
      </div>

      <!-- Members list (show when expanded or leaf) -->
      <Transition name="dir-slide-down">
        <div
          v-if="node.members && node.members.length > 0 && (isRoot || isExpanded(node.id))"
          class="dir-org-node-members"
        >
          <div
            v-for="member in node.members"
            :key="member.id"
            class="dir-org-member"
          >
            <img :src="member.avatar" :alt="member.fullName" class="dir-org-member-avatar" />
            <div class="dir-org-member-info">
              <a href="#" @click.prevent="openEmployee(member.id)" class="dir-org-member-name">
                {{ member.fullName }}
              </a>
              <div class="dir-org-member-pos">{{ member.position }}</div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Recursive children -->
      <Transition name="dir-slide-down">
        <OrganizationTree
          v-if="node.children && node.children.length > 0 && isExpanded(node.id)"
          :nodes="node.children"
          :is-root="false"
          :expanded-ids="expandedIds"
          :selected-id="selectedId"
          @toggle="$emit('toggle', $event)"
          @select="$emit('select', $event)"
        />
      </Transition>
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue'

import { useDirectoryStore } from '@/stores/directory/directoryStore.js'

const props = defineProps({
  nodes: { type: Array, required: true },
  isRoot: { type: Boolean, default: true },
  expandedIds: { type: Array, default: () => [] },
  selectedId: { type: String, default: null }
})

const emit = defineEmits(['toggle', 'select'])
const store = useDirectoryStore()

const isExpanded = (id) => props.expandedIds.includes(id)

const openEmployee = (id) => {
  store.openModal('employeeDetail', id)
}
</script>

<style scoped>
.dir-org-tree {
  list-style: none;
  margin: 0;
  padding: 0 0 0 24px;
}

.dir-org-tree--root {
  padding: 0;
}

.dir-org-tree-node {
  position: relative;
  margin-bottom: 4px;
}

/* Connecting lines */
.dir-org-tree:not(.dir-org-tree--root) .dir-org-tree-node::before {
  content: '';
  position: absolute;
  left: -14px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #e2e8f0;
}

.dir-org-tree:not(.dir-org-tree--root) .dir-org-tree-node:last-child::before {
  height: 24px;
}

.dir-org-tree:not(.dir-org-tree--root) .dir-org-tree-node::after {
  content: '';
  position: absolute;
  left: -14px;
  top: 24px;
  width: 14px;
  height: 1px;
  background: #e2e8f0;
}

/* Org Node */
.dir-org-node {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
  border: 1px solid transparent;
}

.dir-org-node:hover {
  background: #f8fafc;
}

.dir-org-node--selected {
  background: #bfdbfe;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px #3b82f6;
}

.dir-org-node--company {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border: 1px solid #bfdbfe;
  margin-bottom: 8px;
}

/* Toggle button */
.dir-org-node-toggle {
  width: 20px;
  height: 20px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  color: #64748b;
  transition: transform 0.2s, background 0.15s;
  padding: 0;
}
.dir-org-node-toggle svg { width: 14px; height: 14px; }

.dir-org-node-toggle--expanded {
  transform: rotate(90deg);
  background: #dbeafe;
  border-color: #93c5fd;
  color: #2563eb;
}

.dir-org-node-toggle-placeholder {
  width: 20px;
  flex-shrink: 0;
}

/* Node icon */
.dir-org-node-icon-wrap {
  width: 32px;
  height: 32px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dir-org-node--company .dir-org-node-icon-wrap {
  background: #2563eb;
  border-color: #2563eb;
}

.dir-org-node-icon {
  width: 16px;
  height: 16px;
  color: #475569;
}

.dir-org-node--company .dir-org-node-icon {
  color: white;
}

/* Node info */
.dir-org-node-info {
  flex: 1;
  min-width: 0;
}

.dir-org-node-name {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.dir-org-node-code {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 1px;
}

/* Member count */
.dir-org-node-member-count {
  font-size: 11px;
  background: #f0f9ff;
  color: #0284c7;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 99px;
  border: 1px solid #bae6fd;
  white-space: nowrap;
}

/* Members */
.dir-org-node-members {
  padding: 6px 0 6px 42px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dir-org-member {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 6px 10px;
  min-width: 180px;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.dir-org-member:hover {
  border-color: #93c5fd;
  box-shadow: 0 2px 6px rgba(37,99,235,0.08);
}

.dir-org-member-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  object-fit: cover;
  border: 1px solid #e2e8f0;
}

.dir-org-member-info {
  min-width: 0;
}

.dir-org-member-name {
  font-size: 12.5px;
  font-weight: 600;
  color: #0f172a;
  text-decoration: none;
  display: block;
  transition: color 0.15s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dir-org-member-name:hover { color: #2563eb; }

.dir-org-member-pos {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Transition */
.dir-slide-down-enter-active,
.dir-slide-down-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.dir-slide-down-enter-from,
.dir-slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}
.dir-slide-down-enter-to,
.dir-slide-down-leave-from {
  max-height: 1000px;
  opacity: 1;
}

/* Dark mode */
html[data-theme="dark"] .dir-org-node:hover { background-color: #334155; }
html[data-theme="dark"] .dir-org-node-name { color: #f1f5f9; }
html[data-theme="dark"] .dir-org-node-code { color: #94a3b8; }
html[data-theme="dark"] .dir-org-member { background-color: #1e293b; border-color: #334155; }
html[data-theme="dark"] .dir-org-member-name { color: #f1f5f9; }
html[data-theme="dark"] .dir-org-member-pos { color: #94a3b8; }
html[data-theme="dark"] .dir-org-tree:not(.dir-org-tree--root) .dir-org-tree-node::before,
html[data-theme="dark"] .dir-org-tree:not(.dir-org-tree--root) .dir-org-tree-node::after {
  background-color: #475569;
}
html[data-theme="dark"] .dir-org-node-toggle { background-color: #334155; border-color: #475569; }
html[data-theme="dark"] .dir-org-node-icon-wrap { background-color: #0f172a; border-color: #334155; }
html[data-theme="dark"] .dir-org-node-icon { color: #cbd5e1; }
html[data-theme="dark"] .dir-org-node--company { background: #1e3a8a; border-color: #2563eb; }
html[data-theme="dark"] .dir-org-node--company .dir-org-node-icon-wrap { background-color: #2563eb; }
html[data-theme="dark"] .dir-org-node--selected {
  background-color: #1e3a8a;
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px #60a5fa;
}
</style>
