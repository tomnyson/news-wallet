<template>
  <div>
    <h4>Tags</h4>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(tag, index) in tags" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ tag.name }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="removeTags(index)">Delete</button>
            <button class="btn btn-info btn-sm" @click="editTag(index)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
    <input type="text" v-model="newTag" placeholder="New Tag" class="form-control mb-2" />
    <button class="btn btn-primary" @click="addTag">Add Tag</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import newService from '@/services/NewService';
import { notify } from "@kyvg/vue3-notification";

const tags = ref([]);
const newTag = ref('');

onMounted(async () => {
  const response = await newService.getTags();
  console.log( response.data);
  tags.value = response.data;
});

const addTag = async () => {
  if (newTag.value) {
    await newService.addTag({name: newTag.value});
    const response = await newService.getTags();
    tags.value = response.data;
    newTag.value = '';
    notify({
      title: "Category",
      text: "added successfully!",
      type: "success",
    });
  }
};

const removeTag = async (index) => {
  const tag = tags.value[index];
  if (confirm(`Are you sure you want to delete "${Tag.name}"?`)) {
    await newService.deleteTag(category.id);
    const response = await newService.getTags();
    notify({
      title: "Tags",
      text: "Tag deleted successfully!",
    });
    Tags.value = response.data;
  }
};

const editTag = async (index) => {
  const tag = tags.value[index];
  const newName = prompt('Enter new name', tag.name);
  if (newName) {
    await newService.updateTag(tag.id, {name: newName});
    const response = await newService.getTags();
    tags.value = response.data;
    notify({
      title: "Tags",
      text: "Tags updated successfully!",
    });
  }
};

</script>
