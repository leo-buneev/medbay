const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Advices.vue') }],
  },

  {
    path: '/advices',
    name: 'advices',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Advices.vue') }],
  },

  {
    path: '/profile',
    name: 'profile',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Profile.vue') }],
  },

  {
    path: '/history',
    name: 'history',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/History.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
]

export default routes
