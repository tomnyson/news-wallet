<template>
    <div>
      <navbar />
      <div class="d-flex">
        <sidebar />
        <main class="flex-grow-1 p-4">
          <router-view />
        </main>
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from "@/components/Navbar.vue";
  import Sidebar from "@/components/Sidebar.vue";
  
  export default {
    components: {
      Navbar,
      Sidebar,
    },
  };
  </script>