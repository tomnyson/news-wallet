<template>
  <div :class="['border-end vh-100', isCollapsed ? 'collapsed' : 'expanded']">
    <div class="d-flex justify-content-between align-items-center p-3 bg-light">
      <h5 class="m-0">News Portal</h5>
      <button @click="toggleCollapse" class="btn btn-sm btn-outline-primary">
        <font-awesome-icon :icon="isCollapsed ? 'chevron-right' : 'chevron-left'" />
      </button>
    </div>
    <ul class="list-group list-group-flush">
      <li v-for="menu in menus" :key="menu.path" class="list-group-item">
        <router-link :to="menu.path" class="text-decoration-none d-flex align-items-center">
          <font-awesome-icon :icon="menu.icon" class="me-2" />
          <span v-if="!isCollapsed">{{ menu.title }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isCollapsed = ref(false);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const menus = [
  { title: "Dashboard", path: "/admin/users", icon: "fa-chart-line" },
  { title: "Users", path: "/admin/users", icon: "user" },
  { title: "Posts", path: "/admin/posts", icon: "file-alt" },
  { title: "Categories", path: "/admin/categories", icon: "tags" },
  { title: "Tags", path: "/admin/tags", icon: "tag" },
  { title: "Packages", path: "/admin/packages", icon: "box" },
  { title: "Settings", path: "/admin/settings", icon: "cog" },
];
</script>

<style scoped>
.collapsed {
  width: 120px;
  transition: width 0.3s;
}
.expanded {
  width: 250px;
  transition: width 0.3s;
}
.list-group-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.list-group-item .text-decoration-none {
  display: flex;
  align-items: center;
}
.list-group-item .text-decoration-none span {
  transition: opacity 0.3s, margin-left 0.3s;
  opacity: 1;
  margin-left: 8px;
}
.collapsed .text-decoration-none span {
  opacity: 0;
  margin-left: 0;
  pointer-events: none; /* Prevent interaction with invisible text */
}
</style>