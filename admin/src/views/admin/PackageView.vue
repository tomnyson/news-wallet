<template>
  <div>
    <h4>Packages</h4>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Duration</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in packages" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.duration }}</td>
          <td>{{ item.price }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="removePackage(index)">Delete</button>
            <button class="btn btn-info btn-sm" @click="editPackage(item)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
    <h4>Add new package</h4>
    <input type="text" v-model="newPackage.name" placeholder="name" class="form-control mb-2" />
    <input type="number" v-model="newPackage.duration" placeholder="duration" class="form-control mb-2" />
    <input type="number" v-model="newPackage.price" placeholder="price" class="form-control mb-2" />
    <button class="btn btn-primary" @click="addPackage">Add Package</button>
  </div>

  <div class="modal fade" id="packageModal" tabindex="-1" aria-labelledby="packageModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="packageModalLabel">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="savePackage">
              <div class="mb-3">
                <label for="name" class="form-label">Package Name</label>
                <input
                  type="text"
                  id="name"
                  v-model="selectedPackage.name"
                  class="form-control"
                  :readonly="modalMode === 'view'"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="duration" class="form-label">Duration</label>
                <input
                  type="number"
                  id="duration"
                  v-model="selectedPackage.duration"
                  class="form-control"
                  :readonly="modalMode === 'view'"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="price" class="form-label">Price</label>
                <input
                  type="number"
                  id="price"
                  v-model="selectedPackage.price"
                  class="form-control"
                  :readonly="modalMode === 'view'"
                  required
                />
              </div>
              <button v-if="modalMode === 'edit'" type="submit" class="btn btn-primary">Save Changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import newService from '@/services/NewService';
import { notify } from "@kyvg/vue3-notification";

const packages = ref([]);
const newPackage = ref({
  name: '',
  duration: 0,
  price: 0,
});
const modalTitle = ref("");
const modalMode = ref(""); // 'view' or 'edit'
const selectedPackage = ref({});

onMounted(async () => {
  const response = await newService.getPackages();
  packages.value = response.data;
});

const showPackage = (packageItem) => {
  modalTitle.value = "View Package";
  modalMode.value = "view";
  selectedPackage.value = { ...packageItem };
  showModal();
};

// Show modal for editing


const addPackage = async () => {
  // Ensure all required fields are valid
  if (newPackage.value.name.trim() && newPackage.value.duration && newPackage.value.price) {
    try {
      // Prepare the package data
      const packageData = {
        name: newPackage.value.name.trim(),
        duration: newPackage.value.duration,
        price: newPackage.value.price,
      };

      // Call API to add the package
      await newService.addPackages(packageData);

      // Fetch updated list of packages
      const response = await newService.getPackages();
      packages.value = response.data;

      // Reset the input fields
      newPackage.value = { name: "", duration: "", price: "" };

      // Notify success
      notify({
        title: "Package",
        text: "Added successfully!",
        type: "success",
      });
    } catch (error) {
      // Notify failure
      console.error("Error adding package:", error);
      notify({
        title: "Error",
        text: "Failed to add package. Please try again.",
        type: "error",
      });
    }
  } else {
    // Notify user to input valid data
    notify({
      title: "Warning",
      text: "All fields (name, duration, price) are required.",
      type: "warning",
    });
  }
};

const removePackage = async (index) => {
  const current = packages.value[index];
  if (confirm(`Are you sure you want to delete "${current.name}"?`)) {
    await newService.deletePackages(current.id);
    const response = await newService.getPackages();
    notify({
      title: "Packages",
      text: "Package deleted successfully!",
    });
    packages.value = response.data;
  }
};

const editPackage = async (packageItem) => {

  modalTitle.value = "Edit Package";
  modalMode.value = "edit";
  selectedPackage.value = { ...packageItem };

  const current = packages.value[index];
  const newName = prompt('Enter new name', current.name);
  if (newName) {
    await newService.updatePackage(Package.id, {name: newName});
    const response = await newService.getPackages();
    packages.value = response.data;
    notify({
      title: "Packages",
      text: "Packages updated successfully!",
    });
  }
};


</script>
