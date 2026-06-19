import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import DashboardPage from '@/pages/DashboardPage.vue';
import MeetingPage from '@/pages/MeetingPage.vue';
import DirectoryDashboard from '@/pages/directory/DirectoryDashboard.vue';
// @ts-ignore
import NotificationModule from '@/modules/notifications/NotificationModule.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardPage
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: NotificationModule
      },
      {
        path: 'meeting',
        name: 'Meeting',
        component: MeetingPage
      },
      {
        path: 'directory',
        name: 'Directory',
        component: DirectoryDashboard
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
