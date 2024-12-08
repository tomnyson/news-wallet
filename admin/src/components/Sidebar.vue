<template>
    <div class="bg-light border-end vh-100" style="width: 250px;">
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <router-link to="/" class="text-decoration-none">Dashboard</router-link>
        </li>
        <li class="list-group-item">
          <router-link to="/admin/users" class="text-decoration-none">Users</router-link>
        </li>
        <li class="list-group-item">
          <router-link to="/admin/posts" class="text-decoration-none">Posts</router-link>
        </li>
        <li class="list-group-item">
          <router-link to="/admin/categories" class="text-decoration-none">Categories</router-link>
        </li>
        <li class="list-group-item">
          <router-link to="/admin/tags" class="text-decoration-none">Tags</router-link>
        </li>
        <li class="list-group-item">
          <router-link to="/admin/packages" class="text-decoration-none">Packages</router-link>
        </li>
        <li class="list-group-item">
          <router-link to="/settings" class="text-decoration-none">Settings</router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {};
  </script>