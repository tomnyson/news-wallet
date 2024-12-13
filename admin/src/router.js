import { createRouter, createWebHistory } from "vue-router";

// Layouts
import AdminLayout from "@/layouts/AdminLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";

// Pages
import DashboardView from "@/views/admin/DashboardView.vue";
import PostListView from "@/views/admin/posts/PostListView.vue";
import CategoryView from "@/views/admin/CategoryView.vue";
import TagView from "@/views/admin/TagView.vue";
import PackageView from "@/views/admin/PackageView.vue";
import UserView from "@/views/admin/UserView.vue";
import UserDetailView from "@/views/admin/UserDetailView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import SettingView from "@/views/admin/SettingView.vue";
// import Signup from "@/views/auth/Signup.vue";

const routes = [
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      { path: "login", name: "Login", component: LoginView },
      // { path: "signup", name: "Signup", component: Signup },
    ],
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "dashboard", name: "Dashboard", component: DashboardView },
      { path: "posts", name: "Posts", component: PostListView },
      { path: "categories", name: "Categories", component: CategoryView },
      { path: "tags", name: "Tags", component: TagView },
      { path: "packages", name: "Packages", component: PackageView },
      { path: "users", name: "Users", component: UserView },
      { path: "users/:id", name: "UserDetail", component: UserDetailView },
      { path: "settings", name: "Setting", component: SettingView },
    ],
  },
  { path: "/", redirect: "/auth/login" },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: () => import("@/views/NotFound.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); 
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});


export default router;