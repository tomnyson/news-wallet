<template>
    <div class="loading-container" v-if="isLoading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <slot></slot> <!-- Optional custom content -->
    </div>
  </template>
  
  <script>
  export default {
    name: "Loading",
    props: {
      isLoading: {
        type: Boolean,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%; /* Adjust as per usage */
  }
  </style>