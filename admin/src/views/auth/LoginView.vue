<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4" style="width: 350px;">
      <h3 class="text-center mb-3">Sign In</h3>
      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input type="email" id="email" v-model="email" class="form-control" placeholder="Enter email" required />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input type="password" id="password" v-model="password" class="form-control" placeholder="Enter password"
            required />
        </div>
        <button type="submit" class="btn btn-primary w-100">Sign In</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/authService';
import { notify } from "@kyvg/vue3-notification";

const email = ref('');
const password = ref('');
const router = useRouter();

const login = async () => {
  try {
    const response = await authService.login(email.value, password.value);
    notify({
      title: "Authorization",
      text: "You have been logged in!",
    });
    alert('Login successful');
    localStorage.setItem('authToken', response.data.access_token); // Store token
    router.push('/admin/dashboard');
  } catch (error) {
    alert(error.response?.data?.message || 'Login failed');
    console.error(error);
  }
};
</script>

<style>
/* Add styles if necessary */
</style>
