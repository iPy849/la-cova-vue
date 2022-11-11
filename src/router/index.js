import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/Home/HomeView.vue';

const routes = [
  {
    path: '/admin',
    name: 'Admin',
    component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin/AdminLayoutView.vue'),
    children: [
      {
        path: '',
        name: 'AdminMenuEdit',
        component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin/Sections/AdminMenuEditView.vue'),
      },
      {
        path: '/add',
        name: 'AdminMenuAdd',
        component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin/Sections/AdminMenuAddView.vue'),
      },
      {
        path: '/currency-exchange',
        name: 'AdminMenuCurrencyExchange',
        component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin/Sections/AdminMenuCurrencyExchangeView.vue'),
      },
    ],
  },
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
