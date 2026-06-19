<template>
  <div class="dir-cg-wrapper">

    <!-- Toolbar -->
    <div class="dir-cg-toolbar">
      <span class="dir-cg-count-text">{{ groups.length }} nhóm</span>
      <button class="dir-cg-create-btn" @click="openCreate">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Tạo nhóm mới
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="dir-cg-grid">
      <div v-for="i in 4" :key="i" class="dir-cg-card dir-cg-card--loading">
        <div class="dir-cg-skeleton" style="height:20px;width:60%;margin-bottom:10px;border-radius:6px;"></div>
        <div class="dir-cg-skeleton" style="height:14px;width:90%;margin-bottom:20px;border-radius:6px;"></div>
        <div style="display:flex;gap:6px">
          <div v-for="j in 4" :key="j" class="dir-cg-skeleton" style="width:28px;height:28px;border-radius:50%;"></div>
        </div>
      </div>
    </div>

    <!-- Groups grid -->
    <div v-else class="dir-cg-grid">
      <div v-for="group in groups" :key="group.id" class="dir-cg-card">
        <!-- Card header -->
        <div class="dir-cg-header">
          <div class="dir-cg-icon-wrap">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <div class="dir-cg-title-wrap">
            <h3 class="dir-cg-name">{{ group.name }}</h3>
          </div>
          <div class="dir-cg-count-badge">{{ group.memberIds.length }} người</div>
        </div>

        <div class="dir-cg-leader-row">
          <span class="dir-cg-leader-label">Trưởng nhóm:</span>
          <span class="dir-cg-leader-value">{{ getEmployee(group.leaderId)?.fullName || 'Chưa phân bổ' }}</span>
        </div>

        <div class="dir-cg-divider" />

        <!-- Members -->
        <div class="dir-cg-members-row">
          <div class="dir-cg-members-label">Thành viên:</div>
          <div class="dir-cg-avatars">
            <div
              v-for="(memberId, idx) in group.memberIds.slice(0, 5)"
              :key="memberId"
              class="dir-cg-avatar-wrap"
              :style="{ zIndex: group.memberIds.length - idx }"
            >
              <img
                v-if="getEmployee(memberId)"
                :src="getEmployee(memberId).avatar"
                :alt="getEmployee(memberId).fullName"
                :title="getEmployee(memberId).fullName"
                class="dir-cg-avatar"
              />
            </div>
            <div
              v-if="group.memberIds.length > 5"
              class="dir-cg-avatar dir-cg-avatar--more"
              :title="`${group.memberIds.length - 5} người khác`"
            >
              +{{ group.memberIds.length - 5 }}
            </div>
          </div>
        </div>

        <!-- Member names list -->
        <div class="dir-cg-tags">
          <span
            v-for="memberId in group.memberIds"
            :key="memberId"
            class="dir-cg-tag"
          >
            {{ getEmployee(memberId)?.fullName ?? memberId }}
          </span>
        </div>

        <!-- Card footer -->
        <div class="dir-cg-footer">
          <span class="dir-cg-date">
            Tạo {{ formatDate(group.createdAt) }}
          </span>
            <div class="dir-cg-actions">
              <a :href="`mailto:${getGroupEmails(group)}`" class="dir-cg-action-btn dir-cg-action-btn--primary" title="Gửi Email">Email</a>
              <button class="dir-cg-action-btn" @click="openDetail(group)">Chi tiết</button>
              <button class="dir-cg-action-btn" @click="openEdit(group)">Sửa</button>
              <button class="dir-cg-action-btn dir-cg-action-btn--danger" @click="deleteGroup(group.id)">Xóa</button>
            </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="selectedGroup && modalType === 'detail'" class="dir-cg-modal-overlay" @click.self="closeModal">
      <div class="dir-cg-modal-content">
        <div class="dir-cg-modal-header">
          <h3 class="dir-cg-modal-title">Chi tiết nhóm: {{ selectedGroup.name }}</h3>
          <button @click="closeModal" class="dir-cg-modal-close">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="dir-cg-modal-body">
          <p class="dir-cg-modal-desc">{{ selectedGroup.description }}</p>
          <h4 class="dir-cg-modal-subtitle">Thành viên ({{ selectedGroup.memberIds.length }})</h4>
          <div class="dir-cg-modal-list">
            <div v-for="memberId in selectedGroup.memberIds" :key="memberId" class="dir-cg-list-item">
              <img :src="getEmployee(memberId)?.avatar" class="dir-cg-list-avatar" />
              <div class="dir-cg-list-info">
                <div class="dir-cg-list-name">{{ getEmployee(memberId)?.fullName || memberId }}</div>
                <div class="dir-cg-list-pos">{{ getEmployee(memberId)?.position }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="dir-cg-modal-footer">
          <button class="dir-cg-modal-btn" @click="closeModal">Đóng</button>
          <a :href="`mailto:${getGroupEmails(selectedGroup)}`" class="dir-cg-modal-btn dir-cg-modal-btn--primary">Gửi Email Nhóm</a>
        </div>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <div v-if="modalType === 'edit'" class="dir-cg-modal-overlay" @click.self="closeModal">
      <div class="dir-cg-modal-content">
        <div class="dir-cg-modal-header">
          <h3 class="dir-cg-modal-title">{{ editingGroup.id ? 'Chỉnh sửa nhóm' : 'Tạo nhóm mới' }}</h3>
          <button @click="closeModal" class="dir-cg-modal-close">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="dir-cg-modal-body">
          <div class="dir-cg-form-group">
            <label class="dir-cg-form-label">Tên nhóm</label>
            <input v-model="editingGroup.name" type="text" class="dir-cg-form-input" placeholder="Nhập tên nhóm" />
          </div>
          <div class="dir-cg-form-group">
            <label class="dir-cg-form-label">Mô tả</label>
            <textarea v-model="editingGroup.description" class="dir-cg-form-input" rows="2" placeholder="Mô tả mục đích nhóm"></textarea>
          </div>
          <div class="dir-cg-form-group">
            <label class="dir-cg-form-label">Trưởng nhóm</label>
            <select v-model="editingGroup.leaderId" class="dir-cg-form-input">
              <option value="">-- Chọn trưởng nhóm (từ thành viên) --</option>
              <option v-for="empId in editingGroup.memberIds" :key="empId" :value="empId">{{ getEmployee(empId)?.fullName }}</option>
            </select>
          </div>
          <div class="dir-cg-form-group">
            <label class="dir-cg-form-label">Thành viên ({{ editingGroup.memberIds.length }})</label>
            <div class="dir-cg-select-list">
              <label v-for="emp in allEmployees" :key="emp.id" class="dir-cg-select-item">
                <input type="checkbox" :value="emp.id" v-model="editingGroup.memberIds" class="dir-cg-checkbox">
                <img :src="emp.avatar" class="dir-cg-select-avatar" />
                <span class="dir-cg-select-name">{{ emp.fullName }}</span>
              </label>
            </div>
          </div>
        </div>
        <div class="dir-cg-modal-footer">
          <button class="dir-cg-modal-btn" @click="closeModal">Hủy</button>
          <button class="dir-cg-modal-btn dir-cg-modal-btn--primary" @click="saveGroup">Lưu nhóm</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div v-if="modalType === 'delete'" class="dir-cg-modal-overlay" @click.self="closeModal">
      <div class="dir-cg-modal-content dir-cg-modal-content--small">
        <div class="dir-cg-modal-body" style="padding-top: 20px;">
          <h3 class="dir-cg-modal-title" style="margin-bottom: 8px;">Xác nhận xóa</h3>
          <p class="dir-cg-modal-desc">Bạn có chắc chắn muốn xóa nhóm <b>{{ selectedGroup?.name }}</b> không? Hành động này không thể hoàn tác.</p>
        </div>
        <div class="dir-cg-modal-footer">
          <button class="dir-cg-modal-btn" @click="closeModal">Hủy</button>
          <button class="dir-cg-modal-btn dir-cg-modal-btn--danger" @click="confirmDelete">Xóa nhóm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useDirectoryStore } from '@/stores/directory/directoryStore.js'
import { useContactGroups } from '@/services/directory/composables/useDirectory.js'

const store = useDirectoryStore()
const { groups, isLoading, getEmployee } = useContactGroups()
const allEmployees = computed(() => store.employees)
const emit = defineEmits(['close'])

const modalType = ref(null) // 'detail', 'edit', 'delete', null
const selectedGroup = ref(null)
const editingGroup = ref({ id: '', name: '', description: '', leaderId: '', memberIds: [] })

watch(() => editingGroup.value.memberIds, (newMembers) => {
  if (editingGroup.value.leaderId && !newMembers.includes(editingGroup.value.leaderId)) {
    editingGroup.value.leaderId = ''
  }
}, { deep: true })

const getGroupEmails = (group) => {
  if (!group || !group.memberIds) return ''
  return group.memberIds
    .map(id => getEmployee(id)?.email)
    .filter(Boolean)
    .join(';')
}

const copyEmail = async (email) => {
  if (!email) return;
  try {
    await navigator.clipboard.writeText(email);
    alert('Đã sao chép email thành công')
  } catch(e) {}
}

const closeModal = () => {
  modalType.value = null
  selectedGroup.value = null
}

const openDetail = (group) => {
  selectedGroup.value = group
  modalType.value = 'detail'
}

const openCreate = () => {
  editingGroup.value = { id: '', name: '', description: '', leaderId: '', memberIds: [] }
  modalType.value = 'edit'
}

const openEdit = (group) => {
  editingGroup.value = JSON.parse(JSON.stringify(group))
  modalType.value = 'edit'
}

const saveGroup = () => {
  if (!editingGroup.value.name) return alert('Vui lòng nhập tên nhóm')
  if (!editingGroup.value.leaderId) return alert('Vui lòng chọn trưởng nhóm')
  if (editingGroup.value.id) {
    const idx = groups.value.findIndex(g => g.id === editingGroup.value.id)
    if (idx > -1) store.contactGroups[idx] = { ...editingGroup.value }
  } else {
    store.contactGroups.unshift({
      ...editingGroup.value,
      id: 'g-' + Date.now(),
      createdAt: new Date().toISOString()
    })
  }
  closeModal()
}

const deleteGroup = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa nhóm này?')) {
    const idx = store.contactGroups.findIndex(g => g.id === id)
    if (idx > -1) store.contactGroups.splice(idx, 1)
  }
}

const openDelete = (group) => {
  selectedGroup.value = group
  modalType.value = 'delete'
}

const openChat = (group) => {
  const emails = group.memberIds
    .map(id => getEmployee(id)?.email)
    .filter(Boolean)
    .join(',')
  if (emails) {
    window.location.href = `mailto:${emails}?subject=[${group.name}] `
  } else {
    alert('Không tìm thấy email của thành viên trong nhóm')
  }
}
const formatDate = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<style scoped>
.dir-cg-wrapper {
  padding: 10px;
}

/* Toolbar */
.dir-cg-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.dir-cg-count-text {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.dir-cg-create-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.dir-cg-create-btn svg { width: 18px; height: 18px; }
.dir-cg-create-btn:hover { background: #1d4ed8; }

/* Grid */
.dir-cg-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
@media (max-width: 768px) {
  .dir-cg-grid { grid-template-columns: 1fr; }
}

/* Card */
.dir-cg-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.dir-cg-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.dir-cg-icon-wrap {
  width: 40px;
  height: 40px;
  background: #fdf4ff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #e9d5ff;
  color: #9333ea;
}
.dir-cg-icon-wrap svg { width: 20px; height: 20px; }

.dir-cg-title-wrap {
  flex: 1;
  min-width: 0;
}

.dir-cg-name {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.dir-cg-count-badge {
  font-size: 11px;
  background: #fdf4ff;
  color: #9333ea;
  border: 1px solid #e9d5ff;
  padding: 3px 10px;
  border-radius: 999px;
  font-weight: 600;
  white-space: nowrap;
}

/* Leader Row */
.dir-cg-leader-row {
  padding: 10px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
}

.dir-cg-leader-label {
  font-size: 12px;
  color: #64748b;
  margin-right: 8px;
}

.dir-cg-leader-value {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.dir-cg-divider {
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 0;
}

/* Members Row */
.dir-cg-members-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dir-cg-members-label {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
  white-space: nowrap;
}

.dir-cg-avatars {
  display: flex;
  align-items: center;
}

.dir-cg-avatar-wrap {
  margin-right: -8px;
  position: relative;
}

.dir-cg-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid white;
  display: block;
  object-fit: cover;
}

.dir-cg-avatar--more {
  background: #e2e8f0;
  color: #475569;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
}

/* Tags */
.dir-cg-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.dir-cg-tag {
  font-size: 11px;
  background: #f8fafc;
  color: #475569;
  border: 1px solid #e2e8f0;
  padding: 3px 8px;
  border-radius: 6px;
}

/* Footer */
.dir-cg-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
  margin-top: auto;
}

.dir-cg-date {
  font-size: 11.5px;
  color: #94a3b8;
}

.dir-cg-actions {
  display: flex;
  gap: 8px;
}

.dir-cg-action-btn {
  font-size: 12px;
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #475569;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.15s;
}

.dir-cg-action-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
  background: #f8fafc;
}

.dir-cg-action-btn--primary {
  color: #2563eb;
  background: #eff6ff;
  border-color: #bfdbfe;
  text-decoration: none;
}
.dir-cg-action-btn--primary:hover {
  background: #dbeafe;
}

/* Inline Modals (Detail, Edit, Delete) */
.dir-cg-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.dir-cg-modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
.dir-cg-modal-content--small {
  max-width: 400px;
}

.dir-cg-modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dir-cg-modal-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.dir-cg-modal-close {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}
.dir-cg-modal-close svg { width: 20px; height: 20px; }
.dir-cg-modal-close:hover { background: #f1f5f9; color: #475569; }

.dir-cg-modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.dir-cg-modal-desc {
  font-size: 13px;
  color: #475569;
  margin: 0 0 16px 0;
}

.dir-cg-modal-subtitle {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 12px 0;
}

.dir-cg-modal-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dir-cg-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.15s;
}
.dir-cg-list-item:hover { background: #f8fafc; }

.dir-cg-list-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  object-fit: cover;
}

.dir-cg-list-info { flex: 1; }
.dir-cg-list-name { font-size: 13px; font-weight: 600; color: #0f172a; }
.dir-cg-list-pos { font-size: 12px; color: #64748b; }

.dir-cg-modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.dir-cg-modal-btn {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
}
.dir-cg-modal-btn:hover { background: #f8fafc; }
.dir-cg-modal-btn--primary { background: #2563eb; color: white; border-color: #2563eb; }
.dir-cg-modal-btn--primary:hover { background: #1d4ed8; border-color: #1d4ed8; }
.dir-cg-modal-btn--danger { background: #ef4444; color: white; border-color: #ef4444; }
.dir-cg-modal-btn--danger:hover { background: #dc2626; border-color: #dc2626; }

/* Forms */
.dir-cg-form-group {
  margin-bottom: 16px;
}
.dir-cg-form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}
.dir-cg-form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  color: #0f172a;
  outline: none;
}
.dir-cg-form-input:focus { border-color: #3b82f6; }

.dir-cg-select-list {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  max-height: 180px;
  overflow-y: auto;
  padding: 8px;
}
.dir-cg-select-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
}
.dir-cg-select-item:hover { background: #f8fafc; }
.dir-cg-checkbox { cursor: pointer; }
.dir-cg-select-avatar { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
.dir-cg-select-name { font-size: 13px; color: #334155; }

/* Skeleton */
.dir-cg-skeleton {
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200%;
  animation: dir-shimmer 1.5s infinite;
}
@keyframes dir-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Dark mode */
html[data-theme="dark"] .dir-cg-card { background-color: #1e293b; border-color: #334155; }
html[data-theme="dark"] .dir-cg-count-text, html[data-theme="dark"] .dir-cg-leader-label, html[data-theme="dark"] .dir-cg-members-label, html[data-theme="dark"] .dir-cg-date { color: #94a3b8; }
html[data-theme="dark"] .dir-cg-name, html[data-theme="dark"] .dir-cg-leader-value { color: #f1f5f9; }
html[data-theme="dark"] .dir-cg-leader-row { background-color: #0f172a; border-color: #334155; }
html[data-theme="dark"] .dir-cg-icon-wrap { background-color: #3b0764; border-color: #581c87; color: #d8b4fe; }
html[data-theme="dark"] .dir-cg-count-badge { background-color: #3b0764; border-color: #581c87; color: #d8b4fe; }
html[data-theme="dark"] .dir-cg-divider, html[data-theme="dark"] .dir-cg-footer { border-color: #334155; }
html[data-theme="dark"] .dir-cg-tag { background-color: #0f172a; border-color: #334155; color: #94a3b8; }
html[data-theme="dark"] .dir-cg-avatar { border-color: #1e293b; }
html[data-theme="dark"] .dir-cg-avatar--more { background-color: #334155; color: #cbd5e1; }
html[data-theme="dark"] .dir-cg-action-btn { background-color: #1e293b; border-color: #475569; color: #e2e8f0; }
html[data-theme="dark"] .dir-cg-action-btn:hover { background-color: #334155; border-color: #64748b; color: #f8fafc; }
html[data-theme="dark"] .dir-cg-action-btn--primary { background-color: #0f172a; border-color: #1e3a8a; color: #60a5fa; }
html[data-theme="dark"] .dir-cg-action-btn--primary:hover { background-color: #1e3a8a; }

html[data-theme="dark"] .dir-cg-modal-content { background-color: #1e293b; }
html[data-theme="dark"] .dir-cg-modal-header { border-color: #334155; }
html[data-theme="dark"] .dir-cg-modal-title { color: #f1f5f9; }
html[data-theme="dark"] .dir-cg-modal-close:hover { background-color: #334155; }
html[data-theme="dark"] .dir-cg-modal-desc { color: #94a3b8; }
html[data-theme="dark"] .dir-cg-modal-subtitle, html[data-theme="dark"] .dir-cg-list-name { color: #f1f5f9; }
html[data-theme="dark"] .dir-cg-list-item:hover { background-color: #334155; }
html[data-theme="dark"] .dir-cg-list-avatar { border-color: #334155; }
html[data-theme="dark"] .dir-cg-modal-footer { background-color: #0f172a; border-color: #334155; }
html[data-theme="dark"] .dir-cg-modal-btn { background-color: #1e293b; border-color: #475569; color: #e2e8f0; }
html[data-theme="dark"] .dir-cg-modal-btn:hover { background-color: #334155; border-color: #64748b; color: #f8fafc; }
html[data-theme="dark"] .dir-cg-form-label, html[data-theme="dark"] .dir-cg-select-name { color: #f1f5f9; }
html[data-theme="dark"] .dir-cg-form-input, html[data-theme="dark"] .dir-cg-select-list { background-color: #0f172a; border-color: #334155; color: #f1f5f9; }
html[data-theme="dark"] .dir-cg-select-item:hover { background-color: #334155; }
</style>
