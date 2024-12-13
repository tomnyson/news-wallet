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
            required maxlength="8" />
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
    if(response && response.data && response.data.access_token) {
      if(response.data.user.role == "admin") {
      localStorage.setItem('authToken', response.data.access_token); // Store token
      localStorage.setItem('currentUser', response.data.user);
      notify({
          title: "Authorization",
          text: "Login successful",
          type: 'success'
        });
      router.push('/admin/dashboard');
      } else {
        notify({
          title: "Authorization",
          text: "You are not authorized to access this page",
          type: 'error'
        });
      }
    } else {
      notify({
      title: "Authorization",
      text: "Login failed",
      type: 'error'
    });
    }
  } catch (error) {
    notify({
      title: "Authorization",
      text: error.response?.data?.message || 'Login failed',
      type: 'error'
    });
    console.error(error);
  }
};
</script>

<style>
/* Add styles if necessary */
</style>
