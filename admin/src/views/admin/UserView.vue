<template>
  <div>
    <h4>Users</h4>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
              <button class="btn btn-danger btn-sm" @click="removeUsers(index)">Delete</button>
              <button style="margin-left: 10px;" class="btn btn-info btn-sm px-2" @click="editUser(index)">Edit</button>
              <button style="margin-left: 10px;" class="btn btn-info btn-sm px-2" @click="viewHistory(user.id)">History transactions</button>
          </td>
        </tr>
      </tbody>
    </table>
    <input type="text" v-model="newUser" placeholder="New User" class="form-control mb-2" />
    <button class="btn btn-primary" @click="addUser">Add User</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import authService from '@/services/authService';
import { notify } from "@kyvg/vue3-notification";
import { useRouter } from 'vue-router';

const users = ref([]);
const newUser = ref('');

const router = useRouter();
onMounted(async () => {
  const response = await authService.getUsers();
  users.value = response.data;
});

const addUser = async () => {
  if (newUser.value) {
    await newService.addUser({name: newUser.value});
    const response = await newService.getUsers();
    Users.value = response.data;
    newUser.value = '';
    notify({
      title: "Category",
      text: "added successfully!",
      type: "success",
    });
  }
};

const removeUser = async (index) => {
  const User = Users.value[index];
  if (confirm(`Are you sure you want to delete "${User.name}"?`)) {
    await newService.deleteUser(category.id);
    const response = await newService.getUsers();
    notify({
      title: "Users",
      text: "User deleted successfully!",
    });
    Users.value = response.data;
  }
};

const editUser = async (index) => {
  const User = Users.value[index];
  const newName = prompt('Enter new name', User.name);
  if (newName) {
    await newService.updateUser(User.id, {name: newName});
    const response = await newService.getUsers();
    Users.value = response.data;
    notify({
      title: "Users",
      text: "Users updated successfully!",
    });
  }
};

const viewHistory = async (id) => {
  router.push('/admin/users/' + id);
};

</script>
