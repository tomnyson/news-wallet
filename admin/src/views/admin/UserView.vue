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
            <button style="margin-left: 10px;" class="btn btn-info btn-sm px-2" @click="editUser(user)">
              <font-awesome-icon color="#fff" icon="fa-pen" />
            </button>
            <button style="margin-left: 10px;" class="btn btn-info btn-sm px-2" @click="viewHistory(user.id)">
              History transactions
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <Modal v-model="showModal" :title="modalTitle" content="This is a simple modal demonstration!" size="medium"
        :showDefaultActions="true" @confirm="handleConfirm" @close="handleClose">
        <template #default>
          <form @submit.prevent="handleSubmit">
            <div>
              <label for="name">Name</label>
              <input class="form-control" id="name" v-model="name" v-bind="nameAttrs" />
              <span class="text-danger">{{ errors.name }}</span>
            </div>
            <div v-show="!isEditing">
              <label for="email">Email</label>
              <input class="form-control" id="email" v-model="email" v-bind="emailAttrs" />
              <span class="text-danger">{{ errors.email }}</span>
            </div>
            <div v-show="!isEditing">
              <label for="email">Password</label>
              <input class="form-control" id="email" v-model="password" v-bind="passwordAttrs" />
              <span class="text-danger">{{ errors.password }}</span>
            </div>
            <div class="mt-3">
              <input class="form-check-input" type="checkbox" id="role" v-model="role" v-bind="roleAttrs"
                :style="{ 'margin-right': '5px' }" />
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
              <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update User' : 'Add User' }}</button>
            </div>
          </form>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
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
const loading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const modalTitle = computed(() => (isEditing.value ? 'Edit User' : 'Create Post'));
const selectedUser = ref(null);

onMounted(async () => {
  loading.value = true;
  const response = await authService.getUsers();
  users.value = response.data;
  loading.value = false;
});

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: yup.object({
    name: yup.string().required('Name is required'),
    email: yup.lazy(() =>
      isEditing.value
        ? yup.string().email('Invalid email') // Optional email validation in edit mode
        : yup.string().email('Invalid email').required('Email is required')
    ),
    password: yup.lazy(() =>
      isEditing.value
        ? yup.string() // No password validation in edit mode
        : yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required')
    ),
    role: yup.boolean().default(false),
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

const editUser = async (user) => {
  isEditing.value = true
  showModal.value = true;
  name.value = user.name;
  email.value = user.email;
  selectedUser.value = user;
};

const viewHistory = async (id) => {
  router.push('/admin/users/' + id);
};

const handleConfirm = () => {
  console.log('Modal confirmed!')
}

const handleClose = () => {
  console.log('Modal closed')
  resetForm();
}

const onSubmit = handleSubmit(async (formValues) => {
  const action = isEditing.value ? 'update' : 'create';
  const apiMethod = isEditing.value
    ? authService.updateUser
    : authService.addUser;

  const payload = {
    ...formValues,
    role: formValues.role ? 'admin' : 'user',
  };

  try {
    let response;
    if (isEditing.value) {
      response = await apiMethod(selectedUser.value.id, payload);
    } else {
      response = await apiMethod(payload);
    }

    if ((isEditing.value && response.status === 200) || (!isEditing.value && response.status === 201)) {
      notify({
        title: "User",
        text: isEditing.value ? "updated successfully!" : "added successfully!",
        type: "success",
      });

      showModal.value = false;

      const userResponse = await authService.getUsers();
      users.value = userResponse.data;
    } else {
      throw new Error(response.data.message || "Operation failed");
    }
  } catch (error) {
    notify({
      title: "User",
      text: error.message || "An unexpected error occurred",
      type: "error",
    });
  } finally {
    resetForm();
  }
});


const resetForm = () => {
  name.value = '';
  email.value = '';
  password.value = '';
  role.value = false;
  isEditing.value = false;
  selectedUser.value = null;
  showModal.value = false;

}

</script>

<style scoped></style>
