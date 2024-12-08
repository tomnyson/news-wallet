<template>
    <div v-if="!user">
    <p>Loading user details...</p>
  </div>
    <div v-else>
      <h4>User Detail</h4>
      <div class="card mb-4">
        <div class="card-header">General Information</div>
        <div class="card-body">
          <p><strong>ID:</strong> {{ user.id }}</p>
          <p><strong>Name:</strong> {{ user.name }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Role:</strong> {{ user.role }}</p>
          <p><strong>Created At:</strong> {{ formatDate(user.created_at) }}</p>
          <p><strong>Updated At:</strong> {{ formatDate(user.updated_at) }}</p>
        </div>
      </div>
  
      <div class="card mb-4" v-if="user.wallet">
        <div class="card-header">Wallet</div>
        <div class="card-body">
          <p><strong>Wallet ID:</strong> {{ user?.wallet?.id }}</p>
          <p><strong>Balance:</strong> ${{ user?.wallet?.balance }}</p>
          <p><strong>Last Updated:</strong> {{ formatDate(user?.wallet?.updated_at) }}</p>
        </div>
      </div>
  
      <div class="card mb-4">
        <div class="card-header">Transactions</div>
        <div class="card-body">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Method</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(transaction, index) in user.transactions" :key="transaction.id">
                <td>{{ index + 1 }}</td>
                <td>{{ transaction.transaction_id }}</td>
                <td>${{ transaction.amount }}</td>
                <td>{{ transaction.type }}</td>
                <td>{{ transaction.method }}</td>
                <td>{{ formatDate(transaction.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <div class="card mb-4">
        <div class="card-header">Subscriptions</div>
        <div class="card-body">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Package Name</th>
                <th>Duration (Days)</th>
                <th>Price</th>
                <th>Expires At</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(subscription, index) in user.subscriptions" :key="subscription.id">
                <td>{{ index + 1 }}</td>
                <td>{{ subscription.package.name }}</td>
                <td>{{ subscription.package.duration }}</td>
                <td>${{ subscription.package.price }}</td>
                <td>{{ formatDate(subscription.expires_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import authService from "@/services/authService";
  import { useRoute } from "vue-router";
  
  const user = ref(null);
  const route = useRoute();
  const userId = route.params.id;

  console.log('userID: ' + userId);
  // Fetch user detail
  onMounted(async () => {
    if(userId) {
      try {
      const response = await authService.getUserDetail(userId); // Replace with your API call
      console.log(response)
      user.value = response.data.user;
    } catch (error) {
      console.error("Failed to fetch user detail", error);
    }
    }
   
  });
  
  // Format date function
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  </script>
  
  <style scoped>
  .card {
    margin-bottom: 20px;
  }
  </style>