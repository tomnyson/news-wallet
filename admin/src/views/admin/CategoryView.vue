<template>
  <div>
    <h4>Categories</h4>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, index) in categories" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ category.name }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="removeCategory(index)">Delete</button>
            <button class="btn btn-info btn-sm" @click="editCategory(index)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
    <input type="text" v-model="newCategory" placeholder="New Category" class="form-control mb-2" />
    <button class="btn btn-primary" @click="addCategory">Add Category</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import newService from '@/services/NewService';
import { notify } from "@kyvg/vue3-notification";

const categories = ref([]);
const newCategory = ref('');
const oldCategory = ref('');

onMounted(async () => {
  const response = await newService.getCategories();
  categories.value = response.data;
});

const addCategory = async () => {
  if (newCategory.value) {
    await newService.addCategory({name: newCategory.value});
    const response = await newService.getCategories();
    categories.value = response.data;
    newCategory.value = '';
    notify({
      title: "Category",
      text: "added successfully!",
      type: "success",
    });
  }
};

const removeCategory = async (index) => {
  const category = categories.value[index];
  if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
    await newService.deleteCategory(category.id);
    const response = await newService.getCategories();
    notify({
      title: "Category",
      text: "Category deleted successfully!",
    });
    categories.value = response.data;
  }
};

const editCategory = async (index) => {
  const category = categories.value[index];
  const newName = prompt('Enter new name', category.name);
  if (newName) {
    await newService.updateCategory(category.id, {name: newName});
    const response = await newService.getCategories();
    categories.value = response.data;
    notify({
      title: "Category",
      text: "Category updated successfully!",
    });
  }
};

</script>
