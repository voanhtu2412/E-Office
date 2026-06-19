<template>
  <div class="dir-bc-wrapper">
    <!-- Employee selector -->
    <div class="dir-bc-selector-row">
      <label class="dir-bc-selector-label">Chọn nhân viên:</label>
      <select class="dir-bc-select" v-model="selectedId" @change="loadEmployee">
        <option value="">-- Chọn nhân viên --</option>
        <option v-for="e in allEmployees" :key="e.id" :value="e.id">{{ e.fullName }} — {{ e.position }}</option>
      </select>
    </div>

    <div v-if="employee" class="dir-bc-layout">
      <!-- The actual card to export -->
      <div class="dir-bc-card dir-bc-export-safe" ref="cardElementRef">
        
        <!-- Top Section -->
        <div class="dir-bc-top">
          <!-- Left Info -->
          <div class="dir-bc-info">
            <div class="dir-bc-brand">
              <span class="dir-bc-brand-name">eOffice Việt Nam</span>
              <span class="dir-bc-brand-sub">Danh thiếp nhân viên</span>
            </div>
            
            <div class="dir-bc-user">
              <h2 class="dir-bc-name">{{ employee.fullName }}</h2>
              <div class="dir-bc-position">{{ employee.position }}</div>
              <div v-if="dept" class="dir-bc-dept">{{ dept.name }}</div>
            </div>
          </div>
          
          <!-- Right QR Code -->
          <div class="dir-bc-qr-wrap">
            <img :src="qrBlobUrl || qrUrl" alt="QR Code" class="dir-bc-qr-img" />
          </div>
        </div>

        <hr class="dir-bc-divider" />

        <!-- Bottom Contact List -->
        <div class="dir-bc-bottom">
          <div class="dir-bc-contact-list">
            <div class="dir-bc-contact-item">
              <PhoneIcon class="dir-bc-icon" />
              <span class="dir-bc-contact-text">{{ employee.phone }}</span>
            </div>
            <div class="dir-bc-contact-item">
              <EnvelopeIcon class="dir-bc-icon" />
              <span class="dir-bc-contact-text">{{ employee.email }}</span>
            </div>
            <div class="dir-bc-contact-item">
              <PhoneIcon class="dir-bc-icon" />
              <span class="dir-bc-contact-text">Máy lẻ: {{ employee.extension || '102' }}</span>
            </div>
            <div class="dir-bc-contact-item">
              <MapPinIcon class="dir-bc-icon" />
              <span class="dir-bc-contact-text">{{ employee.address }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="dir-bc-actions">
        <button class="dir-bc-btn" @click="shareContactText">
          <ShareIcon class="dir-bc-btn-icon" /> Chia sẻ
        </button>
        <button class="dir-bc-btn" @click="downloadPng">
          <PhotoIcon class="dir-bc-btn-icon" /> PNG
        </button>
        <button class="dir-bc-btn" @click="downloadVcf">
          <UserIcon class="dir-bc-btn-icon" /> vCard
        </button>
        <button class="dir-bc-btn" @click="downloadQr">
          <QrCodeIcon class="dir-bc-btn-icon" /> Mã QR
        </button>
      </div>
    </div>

    <!-- No employee selected -->
    <div v-else class="dir-bc-empty">
      <CreditCardIcon class="dir-bc-empty-icon" />
      <p class="dir-bc-empty-title">Chọn nhân viên để xem danh thiếp</p>
      <p class="dir-bc-empty-desc">Sử dụng danh sách xổ xuống phía trên để chọn nhân viên</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { 
  CreditCardIcon, 
  ShareIcon, 
  PhotoIcon, 
  QrCodeIcon, 
  UserIcon 
} from '@heroicons/vue/24/outline'
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/vue/24/solid'

import { useDirectoryStore } from '@/stores/directory/directoryStore.js'
import { storeToRefs } from 'pinia'

const props = defineProps({
  employeeId: { type: String, default: null }
})

const route = useRoute()
const store = useDirectoryStore()

const { employees: allEmployees, departments } = storeToRefs(store)

const CURRENT_USER_ID = 'emp-001'
const selectedId = ref('')
const employee = ref(null)
const cardElementRef = ref(null)

const initData = () => {
  let targetId = props.employeeId || route.query.id || CURRENT_USER_ID
  let target = allEmployees.value.find(e => e.id === targetId)
  
  if (!target && allEmployees.value.length > 0) {
    target = allEmployees.value[0]
  }

  if (target) {
    selectedId.value = target.id
    employee.value = target
  }
}

onMounted(async () => {
  await store.ensureDirectoryDataLoaded()
  initData()
})

watch(() => props.employeeId, () => {
  initData()
})

const dept = computed(() =>
  employee.value ? departments.value.find((d) => d.id === employee.value.departmentId) : null
)

const loadEmployee = () => {
  employee.value = allEmployees.value.find((e) => e.id === selectedId.value) ?? null
}

const vcardData = computed(() => {
  if (!employee.value) return ''
  const e = employee.value
  return `BEGIN:VCARD\nVERSION:3.0\nFN:${e.fullName}\nTEL:${e.phone}\nEMAIL:${e.email}\nORG:eOffice Việt Nam\nTITLE:${e.position}\nEND:VCARD`
})

const textData = computed(() => {
  if (!employee.value) return ''
  const e = employee.value
  return `Thông tin liên hệ:\n- Họ tên: ${e.fullName}\n- Chức vụ: ${e.position}\n- Phòng ban: ${dept.value?.name || '—'}\n- Số điện thoại: ${e.phone}\n- Email: ${e.email}`
})

const qrUrl = computed(() => `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(vcardData.value)}`)

const qrBlobUrl = ref('')

watch(qrUrl, async (newUrl) => {
  if (!newUrl) return
  try {
    const response = await fetch(newUrl)
    const blob = await response.blob()
    if (qrBlobUrl.value) URL.revokeObjectURL(qrBlobUrl.value)
    qrBlobUrl.value = URL.createObjectURL(blob)
  } catch(e) {
    console.error('Error fetching QR code blob:', e)
  }
}, { immediate: true })

const downloadVcf = () => {
  if (!employee.value) return
  const blob = new Blob([vcardData.value], { type: 'text/vcard' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${employee.value.fullName.replace(/\s+/g, '_')}.vcf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const downloadQr = async () => {
  try {
    const response = await fetch(qrUrl.value)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `QR_${employee.value.fullName.replace(/\s+/g, '_')}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (err) {
    alert('Lỗi tải QR: ' + err.message)
  }
}

const getCanvasBlob = async () => {
  if (!cardElementRef.value) return null
  
  if (!window.htmlToImage) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js'
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  try {
    return await window.htmlToImage.toBlob(cardElementRef.value, {
      pixelRatio: 2,
      backgroundColor: '#ffffff'
    })
  } catch (err) {
    console.error('html-to-image error:', err)
    throw err
  }
}

const downloadPng = async () => {
  try {
    const blob = await getCanvasBlob()
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Danh_thiep_${employee.value.fullName.replace(/\s+/g, '_')}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    alert('Không thể tạo ảnh PNG: ' + error.message)
  }
}

const shareContactText = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Thông tin liên hệ - ' + employee.value.fullName,
        text: textData.value,
      })
    } catch (err) {
      if (err.name !== 'AbortError') {
        copyToClipboardFallback(textData.value)
      }
    }
  } else {
    copyToClipboardFallback(textData.value)
  }
}

const copyToClipboardFallback = (text) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Đã sao chép vào clipboard!')
    }).catch(() => {
      alert('Không thể copy vào clipboard. Vui lòng copy thủ công:\n\n' + text)
    })
  } else {
    alert('Không thể copy vào clipboard. Vui lòng copy thủ công:\n\n' + text)
  }
}
</script>

<style>
/* Adjust modal size */
body .modal-backdrop:has(.dir-bc-wrapper) .modal-container {
  max-width: 850px !important;
  width: 100% !important;
}
</style>

<style scoped>
.dir-bc-wrapper {
  padding: 10px;
}

.dir-bc-selector-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.dir-bc-selector-label {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.dir-bc-select {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  color: #0f172a;
  background: white;
  outline: none;
  cursor: pointer;
  min-width: 280px;
  transition: border-color 0.15s;
}
.dir-bc-select:focus { border-color: #2563eb; }

.dir-bc-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dir-bc-card {
  width: 100%;
  max-width: 750px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(15,23,42,0.08);
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
}

/* Explicit styling for html2canvas to render reliably */
.dir-bc-export-safe {
  background-color: #ffffff;
  color: #0f172a;
}
.dir-bc-export-safe * {
  border-color: #e2e8f0;
}

.dir-bc-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.dir-bc-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.dir-bc-brand {
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
}

.dir-bc-brand-name {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.01em;
}

.dir-bc-brand-sub {
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  margin-top: 2px;
}

.dir-bc-user {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.dir-bc-name {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.dir-bc-position {
  font-size: 18px;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 12px;
}

.dir-bc-dept {
  display: inline-flex;
  background: #eff6ff;
  color: #2563eb;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}

.dir-bc-qr-wrap {
  padding: 12px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border: 1px solid #f1f5f9;
  flex-shrink: 0;
}

.dir-bc-qr-img {
  width: 140px;
  height: 140px;
  max-width: 220px;
  display: block;
}

.dir-bc-divider {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 32px 0;
}

.dir-bc-contact-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.dir-bc-contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dir-bc-icon {
  width: 20px;
  height: 20px;
  color: #2563eb;
  flex-shrink: 0;
}

.dir-bc-contact-text {
  font-size: 15px;
  color: #334155;
  font-weight: 500;
}

/* Action buttons */
.dir-bc-actions {
  margin-top: 32px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.dir-bc-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.dir-bc-btn-icon {
  width: 18px;
  height: 18px;
}

.dir-bc-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
  background: #eff6ff;
}

.dir-bc-empty {
  margin-top: 32px;
  text-align: center;
  color: #64748b;
}
.dir-bc-empty-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px auto;
  opacity: 0.5;
}
.dir-bc-empty-title {
  font-size: 16px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 4px;
}
.dir-bc-empty-desc {
  font-size: 14px;
}

@media (max-width: 768px) {
  .dir-bc-card { padding: 24px 20px; }
  .dir-bc-top { flex-direction: column-reverse; align-items: center; text-align: center; }
  .dir-bc-user, .dir-bc-brand { align-items: center; }
  .dir-bc-qr-wrap { margin-bottom: 20px; }
  .dir-bc-contact-list { grid-template-columns: 1fr; gap: 16px; }
  .dir-bc-actions { flex-direction: column; align-items: stretch; width: 100%; }
}

/* Dark mode */
html[data-theme="dark"] .dir-bc-selector-label { color: #f1f5f9; }
html[data-theme="dark"] .dir-bc-select { background-color: #1e293b; border-color: #334155; color: #f1f5f9; }
html[data-theme="dark"] .dir-bc-btn { background-color: #1e293b; border-color: #475569; color: #e2e8f0; }
html[data-theme="dark"] .dir-bc-btn:hover { background-color: #334155; border-color: #64748b; color: #f8fafc; }
html[data-theme="dark"] .dir-bc-empty-title { color: #f1f5f9; }
/* IMPORTANT: Card is forced to white even in dark mode for html2canvas consistency */
</style>
