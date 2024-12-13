<template>
  <div>
    <div class="d-flex justify-content-between">
      <h4>Setting</h4>
      <button @click="showModal = true" class="btn btn-success mb-3">
        Add New <font-awesome-icon icon="plus" />
      </button>
    </div>
    <Loading :isLoading="loading" />
    <table v-show="!isLoading" class="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Key</th>
          <th>Value</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(setting, index) in settings" :key="index">
          <td>{{ setting.id }}</td>
          <td>{{ setting.key }}</td>
            <td>{{ setting.value.length > 50 ? setting.value.substring(0, 50) + '...' : setting.value }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="removeSetting(setting)">Delete</button>
            <button class="btn btn-info btn-sm" @click="editSetting(setting)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
    <Modal
      v-model="showModal"
      title="create Setting"
      content="This is a simple modal demonstration!"
      size="small"
      :showDefaultActions="true"
      @confirm="handleConfirm"
      @close="handleClose"
    >
      <template #default>
        <form @submit.prevent="handleSubmit">
          <div>
            <label for="name">Key</label>
            <input class="form-control" id="name" v-model="key" v-bind="keyAttrs" />
            <span class="text-danger">{{ errors.key }}</span>
          </div>
          <div>
            <label for="name">Value</label>
            <input class="form-control" id="name" v-model="value" v-bind="valueAttrs" />
            <span class="text-danger">{{ errors.value }}</span>
          </div>
        </form>
      </template>
      <template #footer>
        <form @submit.prevent="onSubmit">
          <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-secondary me-2" @click="handleClose">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Add Setting</button>
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

const settings = ref([]);
const newSetting = ref('');
const showModal = ref(false)
const loading = ref(false)
const limit = ref(3)

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: yup.object({
    key: yup.string().required(),
    value: yup.string().required(),
  }),
});

const [key, keyAttrs] = defineField('key');
const [value, valueAttrs] = defineField('value');

onMounted(async () => {
  fetchSettings();
});

const onSubmit = handleSubmit(async (formValues) => {
    await newService.postSettings(formValues);
    await fetchSettings();
    newSetting.value = '';
    notify({
      title: "Setting",
      text: "added successfully!",
      type: "success",
    });
    showModal.value = false;
});

const removeSetting = async (setting) => {
  console.log(setting)
  if (confirm(`Are you sure you want to delete "${setting.key}"?`)) {
    await newService.deleteSettings(setting.id);
    await fetchSettings();
    notify({
      title: "Setting",
      text: "Setting deleted successfully!",
    });
  }
};

const editSetting = async (setting) => {
  const newName = prompt('Enter new name', setting.value);
  if (newName) {
    await newService.updateSettings(setting.id, {key: setting.key, value: newName});
    await fetchSettings();
    notify({
      title: "Setting",
      text: "Setting updated successfully!",
    });
  }
};

const handleClose = () => {
  console.log('Modal closed')
}

const fetchSettings= async () => {
  loading.value = true;
  const response = await newService.getSettings();
  console.log(response)
  settings.value = response.data;
  loading.value = false;
}
</script>
