<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Admin Dashboard</a>
      <ul class="navbar-nav ms-auto">
        <li class="nav-item" v-if="isLoggedIn">
          <a class="nav-link" href="#" @click="logout">Logout</a>
        </li>
        <li class="nav-item" v-else>
          <router-link to="/login" class="nav-link">Sign In</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const isLoggedIn = ref(false);
const router = useRouter();

if (localStorage.getItem("authToken")) {
  isLoggedIn.value = true;
}

const logout = () => {
  localStorage.removeItem("authToken"); // Clear token
  isLoggedIn.value = false; // Update state
  router.push("/auth/login"); // Redirect to login
};
</script>