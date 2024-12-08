<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-4">
          <h3 class="text-center">Admin Login</h3>
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" v-model="email" class="form-control" id="email" required />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" v-model="password" class="form-control" id="password" required />
            </div>
            <button type="submit" class="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: '',
      };
    },
    methods: {
      handleLogin() {
        // For demo purposes, mock authentication
        if (this.email === 'admin@admin.com' && this.password === 'admin') {
          this.$emit('authenticated');
        } else {
          alert('Invalid credentials!');
        }
      },
    },
  };
  </script>
  