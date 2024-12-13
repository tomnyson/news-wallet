<template>
  <div>
    <h4>Users</h4>
    <button @click="showModal = true" class="btn btn-success mb-3">
      Add User <font-awesome-icon icon="user" />
    </button>
    <Loading :isLoading="loading" />
    <table v-show="!loading" class="table table-bordered">
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
            <button class="btn btn-danger btn-sm" @click="removeUser(index)">
              <font-awesome-icon icon="fa-trash" />
            </button>
            <button
              style="margin-left: 10px;"
              class="btn btn-info btn-sm px-2"
              @click="editUser(index)"
            >
              <font-awesome-icon color="#fff" icon="fa-pen" />
            </button>
            <button
              style="margin-left: 10px;"
              class="btn btn-info btn-sm px-2"
              @click="viewHistory(user.id)"
            >
              History transactions
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <Modal
        v-model="showModal"
        title="create new user"
        content="This is a simple modal demonstration!"
        size="medium"
        :showDefaultActions="true"
        @confirm="handleConfirm"
        @close="handleClose"
      >
        <template #default>
          <form @submit.prevent="handleSubmit">
            <div>
              <label for="name">Name</label>
              <input class="form-control" id="name" v-model="name" v-bind="nameAttrs" />
              <span class="text-danger">{{ errors.name }}</span>
            </div>
            <div>
              <label for="email">Email</label>
              <input class="form-control" id="email" v-model="email" v-bind="emailAttrs" />
              <span class="text-danger">{{ errors.email }}</span>
            </div>
            <div>
              <label for="email">Password</label>
              <input class="form-control" id="email" v-model="password" v-bind="passwordAttrs" />
              <span class="text-danger">{{ errors.password }}</span>
            </div>
            <div class="mt-3">
              <input
                class="form-check-input"
                type="checkbox"
                id="role"
                v-model="role"
                v-bind="roleAttrs"
                :style="{ 'margin-right': '5px' }"
              />
              <label class="form-check-label" for="role">Admin</label> <br />
              <span class="text-danger">{{ errors.role }}</span>
            </div>
          </form>
        </template>

        <template #footer>
          <form @submit.prevent="onSubmit">
            <div class="d-flex justify-content-end">
              <button type="button" class="btn btn-secondary me-2" @click="handleClose">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">Add User</button>
            </div>
          </form>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import authService from '@/services/authService';
import { notify } from "@kyvg/vue3-notification";
import Modal from '@/components/Modal.vue'
import Loading from "@/components/Loading.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";

import { useRouter } from 'vue-router';
const users = ref([]);
const newUser = ref('');
const router = useRouter();
const showModal = ref(false)
const loading = ref(false)


onMounted(async () => {
  loading.value = true;
  const response = await authService.getUsers();
  users.value = response.data;
  loading.value = false;
});

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: yup.object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
    role: yup.string().required(),
  }),
});

const [email, emailAttrs] = defineField('email');
const [name, nameAttrs] = defineField('name');
const [password, passwordAttrs] = defineField('password');
const [role, roleAttrs] = defineField('role');

const removeUser = async (index) => {
  const user = users.value[index];
  if (confirm(`Are you sure you want to delete "${user.name}"?`)) {
    await authService.deleteUser(user.id);
    const response = await authService.getUsers();
    notify({
      title: "Users",
      text: "User deleted successfully!",
      type: "success",
    });
    users.value = response.data;
  }
};

const editUser = async (index) => {
  // const user = Users.value[index];
  // const newName = prompt('Enter new name', User.name);
  // if (newName) {
  //   await authService.updateUser(User.id, { name: newName });
  //   const response = await newService.getUsers();
  //   Users.value = response.data;
  //   notify({
  //     title: "Users",
  //     text: "Users updated successfully!",
  //   });
  // }
};

const viewHistory = async (id) => {
  router.push('/admin/users/' + id);
};

const handleConfirm = () => {
  console.log('Modal confirmed!')
  // Add your confirmation logic here
}

const handleClose = () => {
  console.log('Modal closed')
  // Add any cleanup or additional close logic
}

const onSubmit = handleSubmit(async (formValues) => {
  const responseCreate = await authService.addUser({...formValues, role: formValues.role ? 'admin' : 'user'});
  if(responseCreate.status == 201) {
    notify({
      title: "User",
      text: "added successfully!",
      type: "success",
    });
    showModal.value = false;
  const response = await authService.getUsers();
  users.value = response.data;
  } else {
    notify({
      title: "User",
      text: responseCreate.data.message,
      type: "error",
    });
  }
});
</script>

<style scoped></style>
