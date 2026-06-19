<template>
  <div class="dir-export-wrapper">
    <div class="dir-export-layout">
      <!-- Left Configuration -->
      <div class="dir-export-config">
        <h4 class="dir-export-title">Định dạng xuất</h4>
        <div class="dir-export-formats">
          <label class="dir-export-radio" :class="{'dir-export-radio--active': format === 'excel'}">
            <input type="radio" v-model="format" value="excel" name="export-format" />
            <div class="dir-export-radio-content">
              <svg class="dir-export-radio-icon dir-export-icon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <div class="dir-export-radio-text">
                <div class="dir-export-radio-name">Excel (.xlsx)</div>
                <div class="dir-export-radio-desc">Đầy đủ thông tin, có định dạng</div>
              </div>
            </div>
          </label>
          <label class="dir-export-radio" :class="{'dir-export-radio--active': format === 'csv'}">
            <input type="radio" v-model="format" value="csv" name="export-format" />
            <div class="dir-export-radio-content">
              <svg class="dir-export-radio-icon dir-export-icon-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
              <div class="dir-export-radio-text">
                <div class="dir-export-radio-name">CSV (.csv)</div>
                <div class="dir-export-radio-desc">Dữ liệu thô, dung lượng nhẹ</div>
              </div>
            </div>
          </label>
          <label class="dir-export-radio" :class="{'dir-export-radio--active': format === 'pdf'}">
            <input type="radio" v-model="format" value="pdf" name="export-format" />
            <div class="dir-export-radio-content">
              <svg class="dir-export-radio-icon dir-export-icon-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
              <div class="dir-export-radio-text">
                <div class="dir-export-radio-name">PDF (.pdf)</div>
                <div class="dir-export-radio-desc">Danh bạ bản in gọn gàng</div>
              </div>
            </div>
          </label>
          <label class="dir-export-radio" :class="{'dir-export-radio--active': format === 'vcard'}">
            <input type="radio" v-model="format" value="vcard" name="export-format" />
            <div class="dir-export-radio-content">
              <svg class="dir-export-radio-icon dir-export-icon-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/>
              </svg>
              <div class="dir-export-radio-text">
                <div class="dir-export-radio-name">vCard (.vcf)</div>
                <div class="dir-export-radio-desc">Nhập trực tiếp vào danh bạ đt</div>
              </div>
            </div>
          </label>
        </div>

        <h4 class="dir-export-title" style="margin-top: 24px;">Phạm vi dữ liệu</h4>
        <div class="dir-export-scope">
          <div class="dir-export-checkbox-label">
            <span class="dir-export-checkbox-text">Phạm vi: Toàn bộ nhân viên ({{ store.employees.length }})</span>
          </div>
        </div>
      </div>

      <!-- Right Preview -->
      <div class="dir-export-preview">
        <h4 class="dir-export-title">Xem trước</h4>
        <div class="dir-export-preview-box">
          <!-- Adjusted icon size max 96px -->
          <svg class="dir-export-preview-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <div class="dir-export-preview-text">
            Báo cáo sẽ bao gồm: <br/>
            <strong>{{ store.employees.length }}</strong> liên hệ<br/>
            Định dạng: <strong>{{ format.toUpperCase() }}</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="dir-export-actions">
      <button class="dir-export-btn-cancel" @click="$emit('close')">Hủy</button>
      <button class="dir-export-btn-primary" @click="handleExport">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
        Xuất dữ liệu
      </button>
      <button class="dir-export-btn-share" @click="handleShare">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
        Chia sẻ
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDirectoryStore } from '@/stores/directory/directoryStore.js'

const store = useDirectoryStore()
const emit = defineEmits(['close'])

const format = ref('excel')
const scopeAll = ref(true)

const handleExport = () => {
  alert(`Đã xuất file ${format.value.toUpperCase()} với ${store.employees.length} liên hệ.`)
  emit('close')
}

const handleShare = () => {
  alert('Đã tạo link chia sẻ.')
  emit('close')
}
</script>

<style scoped>
.dir-export-wrapper {
  padding: 10px;
}

.dir-export-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
@media (min-width: 768px) {
  .dir-export-layout { flex-direction: row; }
}

.dir-export-config {
  flex: 1;
}

.dir-export-title {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 16px 0;
}

.dir-export-formats {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
@media (min-width: 640px) {
  .dir-export-formats { grid-template-columns: 1fr 1fr; }
}

.dir-export-radio {
  display: block;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  background: white;
  transition: all 0.2s;
}
.dir-export-radio:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.dir-export-radio--active {
  border-color: #3b82f6;
  background: #eff6ff;
  box-shadow: 0 0 0 1px #3b82f6;
}

.dir-export-radio input {
  display: none;
}

.dir-export-radio-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dir-export-radio-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}
.dir-export-icon-green { color: #10b981; }
.dir-export-icon-blue { color: #3b82f6; }
.dir-export-icon-red { color: #ef4444; }
.dir-export-icon-purple { color: #8b5cf6; }

.dir-export-radio-text {
  display: flex;
  flex-direction: column;
}

.dir-export-radio-name {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.dir-export-radio-desc {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.dir-export-scope {
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.dir-export-checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.dir-export-checkbox {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
  cursor: pointer;
}

.dir-export-checkbox-text {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.dir-export-preview {
  width: 100%;
}
@media (min-width: 768px) {
  .dir-export-preview { width: 280px; }
}

.dir-export-preview-box {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  height: 240px; /* Capped height */
}

.dir-export-preview-icon {
  width: 96px; /* Icon size max 96px per rule */
  height: 96px;
  color: #94a3b8;
  margin-bottom: 24px;
}

.dir-export-preview-text {
  text-align: center;
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
}
.dir-export-preview-text strong {
  color: #0f172a;
  font-weight: 600;
}

.dir-export-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.dir-export-btn-cancel {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}
.dir-export-btn-cancel:hover { background: #f8fafc; border-color: #94a3b8; }

.dir-export-btn-primary {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background: #2563eb;
  border: 1px solid #2563eb;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.15s;
}
.dir-export-btn-primary svg { width: 18px; height: 18px; }
.dir-export-btn-primary:hover { background: #1d4ed8; border-color: #1d4ed8; }

.dir-export-btn-share {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.15s;
}
.dir-export-btn-share svg { width: 18px; height: 18px; }
.dir-export-btn-share:hover { background: #dbeafe; border-color: #93c5fd; }

/* Dark theme overrides */
html[data-theme="dark"] .dir-export-title,
html[data-theme="dark"] .dir-export-checkbox-text {
  color: #f1f5f9;
}
html[data-theme="dark"] .dir-export-radio {
  background-color: #1e293b;
  border-color: #334155;
}
html[data-theme="dark"] .dir-export-radio:hover {
  background-color: #334155;
}
html[data-theme="dark"] .dir-export-radio--active {
  background-color: #0f172a;
  border-color: #38bdf8;
  box-shadow: 0 0 0 1px #38bdf8;
}
html[data-theme="dark"] .dir-export-radio-name,
html[data-theme="dark"] .dir-export-preview-text strong {
  color: #f1f5f9;
}
html[data-theme="dark"] .dir-export-radio-desc,
html[data-theme="dark"] .dir-export-preview-text {
  color: #94a3b8;
}
html[data-theme="dark"] .dir-export-scope,
html[data-theme="dark"] .dir-export-preview-box {
  background-color: #0f172a;
  border-color: #334155;
}
html[data-theme="dark"] .dir-export-actions {
  border-color: #334155;
}
html[data-theme="dark"] .dir-export-btn-cancel {
  background-color: #1e293b;
  border-color: #475569;
  color: #e2e8f0;
}
html[data-theme="dark"] .dir-export-btn-cancel:hover {
  background-color: #334155;
  color: #f8fafc;
}
html[data-theme="dark"] .dir-export-btn-share {
  background-color: #0f172a;
  border-color: #0c4a6e;
  color: #38bdf8;
}
html[data-theme="dark"] .dir-export-btn-share:hover {
  background-color: #0284c7;
  color: white;
}
</style>
