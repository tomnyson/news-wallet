<template>
    <div class="container text-center vh-100 d-flex flex-column justify-content-center align-items-center">
      <h1 class="display-1 text-danger">404</h1>
      <h2 class="mb-4">Page Not Found</h2>
      <p class="lead mb-4">Sorry, the page you are looking for does not exist or has been moved.</p>
      <router-link to="/" class="btn btn-primary">
        <i class="bi bi-house-door"></i> Go to Home
      </router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: "NotFound",
  };
  </script>