<template>
  <div>
    <div class="d-flex justify-content-between">
      <h4>Tags</h4>
      <button @click="showModal = true" class="btn btn-success mb-3">
        Add New <font-awesome-icon icon="plus" />
      </button>
    </div>
    <Loading :isLoading="loading" />
    <table v-show="!isLoading" class="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(tag, index) in tags" :key="index">
          <td>{{ tag.id }}</td>
          <td>{{ tag.name }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="removeTag(Tag)">Delete</button>
            <button style="margin-left: 5px" class="btn btn-info btn-sm" @click="editTag(Tag)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
    <nav v-if="pagination.last_page>1" aria-label="Page pagination example">
      <ul v-show="!navigation" class="pagination">
        <li class="page-item">
          <a class="page-link" href="#"  @click.prevent="fetchTags(pagination.current_page -1)">Previous</a>
        </li>
        <li class="page-item" v-for="page in pagination.last_page" :key="page">
          <a class="page-link" href="#" @click.prevent="fetchTags(page)">{{ page }}</a>
        </li>
        <li class="page-item"><a class="page-link" href="#" @click.prevent="fetchTags(pagination.current_page+1)">Next</a></li>
      </ul>
    </nav>
    <Modal
      v-model="showModal"
      title="create Tag"
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
        </form>
      </template>
      <template #footer>
        <form @submit.prevent="onSubmit">
          <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-secondary me-2" @click="handleClose">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Add Tag</button>
          </div>
        </form>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import newService from '@/services/NewService';
import { notify } from "@kyvg/vue3-notification";
import Modal from '@/components/Modal.vue'
import Loading from "@/components/Loading.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";

const tags = ref([]);
const newTag = ref('');
const oldTag = ref('');
const showModal = ref(false)
const loading = ref(false)
const limit = ref(3)
const pagination = ref({
        current_page: 1,
        last_page: 1,
        next_page_url: null,
        prev_page_url: null,
        links: [],
      })

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: yup.object({
    name: yup.string().required(),
  }),
});

const [name, nameAttrs] = defineField('name');

onMounted(async () => {
  fetchTags();
});

const onSubmit = handleSubmit(async (formValues) => {
    await newService.addTag(formValues);
    await fetchTags();
    newTag.value = '';
    notify({
      title: "Tag",
      text: "added successfully!",
      type: "success",
    });
    showModal.value = false;
});

const removeTag = async (Tag) => {
  console.log(Tag.id)
  if (confirm(`Are you sure you want to delete "${Tag.name}"?`)) {
    await newService.deleteTag(Tag.id);
    await fetchTags();
    notify({
      title: "Tag",
      text: "Tag deleted successfully!",
    });
  }
};

const editTag = async (Tag) => {
  const newName = prompt('Enter new name', Tag.name);
  if (newName) {
    await newService.updateTag(Tag.id, {name: newName});
    await fetchTags();
    notify({
      title: "Tag",
      text: "Tag updated successfully!",
    });
  }
};

const handleClose = () => {
  console.log('Modal closed')
}

const fetchTags = async (page) => {
  loading.value = true;
  const queryString = {
    limit: limit.value,
    page: page || pagination.value.current_page,
  }
  const response = await newService.getTags(queryString);
  tags.value = response.data.data;
  pagination.value = {
    current_page: response.data.current_page,
    last_page: response.data.last_page,
    total: response.data.total,
  };
  loading.value = false;
}
</script>
