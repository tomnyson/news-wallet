<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
      <thead class="bg-gray-200">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Role</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-300">
        <tr v-for="(user, index) in users" :key="index" class="hover:bg-gray-100">
          <td class="px-6 py-4 text-sm text-gray-900">{{ user.name }}</td>
          <td class="px-6 py-4 text-sm text-gray-900">{{ user.email }}</td>
          <td class="px-6 py-4 text-sm text-gray-900">{{ user.role }}</td>
          
          <td class="px-6 py-4 text-sm">
            <button
              class="px-4 py-2 mr-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              @click="editUser(user.id)"
            >
              Edit
            </button>
            <button
              class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              @click="deleteUser(user.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const users = ref([
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'Editor' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'Viewer' },
])

const editUser = (id: number) => {
  alert(`Edit user with ID: ${id}`)
}

const deleteUser = (id: number) => {
  const confirmation = confirm('Are you sure you want to delete this user?')
  if (confirmation) {
    users.value = users.value.filter((user) => user.id !== id)
  }
}
</script>