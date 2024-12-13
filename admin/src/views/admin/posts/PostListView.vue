<template>
  <div>
    <div class="d-flex justify-content-between">
      <h4>Posts</h4>
      <button @click="showModal = true" class="btn btn-success mb-3">
        Add New <font-awesome-icon icon="plus" />
      </button>
    </div>
    <Loading :isLoading="loading" />
    <table v-show="!isLoading" class="table table-bordered">
      <thead>
        <tr>
              <th>#</th>
              <th>Title</th>
              <th>Category</th>
              <th>Tags</th>
              <th>Image</th>
              <th>Content Type</th>
              <th>Create At</th>
              <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(post, index) in posts" :key="index">
          <td>{{ post.id }}</td>
          <td>{{ post.title }}</td>
          <td>{{ post.category.name }}</td>
          <td>
            <span v-for="(tag, i) in post.tags" :key="i" class="badge bg-secondary me-2">
              {{ tag.name }}
            </span>
          </td>
          <td>
            <img
              v-if="post.image"
              :src="`${image_url}/${post.image}`"
              alt="Post Image"
              class="img-thumbnail"
              width="100"
            />
          </td>
          <td>
            <span :class="['badge me-2', post.type == 'paid' ? 'bg-success': 'bg-primary']">{{ post.type }}</span>
          </td>
            <td>{{ new Date(post.created_at).toLocaleString() }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="removePost(post)">Delete</button>
            <button class="btn btn-info btn-sm" @click="editPost(post)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
    <nav v-if="pagination.last_page>1" aria-label="Page pagination example">
      <ul v-show="!navigation" class="pagination">
        <li class="page-item">
          <a class="page-link" href="#" @click.prevent="fetchPosts(pagination.current_page -1)"
            >Previous</a
          >
        </li>
        <li class="page-item" v-for="page in pagination.last_page" :key="page">
          <a class="page-link" href="#" @click.prevent="fetchPosts(page)">{{ page }}</a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#" @click.prevent="fetchPosts(pagination.current_page+1)"
            >Next</a
          >
        </li>
      </ul>
    </nav>
    <Modal
      v-model="showModal"
       :title="modalTitle"
      size="large"
      :showDefaultActions="true"
      @confirm="handleConfirm"
      @close="handleClose"
    >
      <template #default>
        <form @submit.prevent="handleSubmit">
          <!-- First Row -->
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="title" class="form-label">Title</label>
              <input
                type="text"
                id="title"
                v-model="title"
                v-bind="titleAttrs"
                class="form-control"
                placeholder="Enter post title"
                required
              />
              <span class="text-danger">{{ errors.title }}</span>
            </div>
            <div class="col-md-6 mb-3">
              <label for="category" class="form-label">Category</label>
              <v-select
                :options="categories.map(category => ({ label: category.name, value: category.id }))"
                v-model="category_id"
                v-bind="categoryIdAttrs"
                placeholder="Select a category"
              />
              <span class="text-danger">{{ errors.category_id }}</span>
            </div>
          </div>
          <!-- Second Row -->
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="tags" class="form-label">Tags</label>
              <v-select
                :options="tagLists.map(tag => ({ label: tag.name, value: Number(tag.id) }))"
                v-model="tags"
                v-bind="tagsAttrs"
                multiple
                placeholder="Select hash tags"
              />
              <span class="text-danger">{{ errors.tags }}</span>
            </div>
            <div class="col-md-6 mb-3">
              <label for="image" class="form-label">Image</label>
              <input type="file" id="image" class="form-control" @change="handleImageUpload" />
              <img class="mt-3 img-thumbnail" v-if="imagePreview" :src="imagePreview" alt="Image preview" style="width: 100px;" />
            </div>
          </div>

          <!-- Third Row -->
          <div class="row">
            <div class="col-md-12 mb-3">
              <label for="content" class="form-label">Content</label>
              <Editor
                v-model="content"
                v-bind="contentAttrs"
                api-key="j16t3n51cam680u6a2ixha4eqgxu4rxa17g4ea37dexqbclh"
                :init="{   height: 200,  plugins: 'lists link image table code help wordcount' }"
              />
              <span class="text-danger">{{ errors.content }}</span>
            </div>
          </div>
          <!-- Fourth Row -->
          <div class="row">
            <div class="col-md-6 mb-3 form-check">
              <input
                type="checkbox"
                id="isPaid"
                class="form-check-input"
                v-model="type"
                v-bind="typeAttrs"
              />
              <label for="isPaid" class="form-check-label">Paid Content</label>
            </div>
            <span class="text-danger">{{ errors.type }}</span>
          </div>
        </form>
      </template>
      <template #footer>
        <form @submit.prevent="onSubmit">
          <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-secondary me-2" @click="handleClose">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">{{ isEditing ? "Update Post" : "Add Post" }}</button>
          </div>
        </form>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import newService from '@/services/NewService';
import { notify } from "@kyvg/vue3-notification";
import Modal from '@/components/Modal.vue'
import Loading from "@/components/Loading.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import Editor from '@tinymce/tinymce-vue'
const image_url = process.env.VUE_APP_STATIC_URL;

const posts = ref([]);

const newPost = ref('');
const oldPost = ref('');
const showModal = ref(false)
const loading = ref(false)
const limit = ref(3)
const categories = ref([]);
const tagLists = ref([]);
const pagination = ref({
        current_page: 1,
        last_page: 1,
        next_page_url: null,
        prev_page_url: null,
        links: [],
      })
const isEditing = ref(false);
const editedPost = ref(null);
const modalTitle = computed(() => (isEditing.value ? 'Edit Post' : 'Create Post'));

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: yup.object({
  title: yup.string().required('Title is required'),
  content: yup.string().required('Content is required'),
  category_id:
      yup.object().shape({
        label: yup.string().required(),
        value: yup.string().required(),
      })
    .required('Category is required'),
  tags: yup
    .array()
    .of(
      yup.object().shape({
        label: yup.string().required(),
        value: yup.string().required(),
      })
    )
    .required('Tags are required'),
  type: yup.boolean().default(false),
  }),
});

const [title, titleAttrs] = defineField('title');
const [content, contentAttrs] = defineField('content');
const [category_id, categoryIdAttrs] = defineField('category_id');
const [tags, tagsAttrs] = defineField('tags');
const [type, typeAttrs] = defineField('type');
const image = ref(null);
const imagePreview = ref(null);

onMounted(async () => {
  fetchPosts();
  const response = await newService.getCategories();
  categories.value = response.data.data;
  const tagResponse = await newService.getTags();
  tagLists.value = tagResponse.data.data;
  console.log(response.data.data)
});

const onSubmit = handleSubmit(async (formValues) => {

  const formData = new FormData();
    formData.append("title", title.value);
    formData.append("content", content.value);
    formData.append("category_id", category_id.value.value);
    tags.value.forEach((tag) => formData.append("tags[]", tag.value));
    if (image.value) {
      formData.append("image", image.value);
    }
    formData.append("type",type == true ? 'paid' : 'free');

    if (isEditing.value) {
      await newService.updatePost(editedPost.value.id, formData);
      notify({
        title: "Post",
        text: "Post updated successfully!",
      });
    } else {
      await newService.addPost(formData);
      notify({
        title: "Post",
        text: "Post added successfully!",
      });
    }

    await fetchPosts();
    resetForm();
});

const removePost = async (post) => {
  if (confirm(`Are you sure you want to delete "${post.id}"?`)) {
    await newService.deletePost(post.id);
    await fetchPosts();
    notify({
      title: "Post",
      text: "Post deleted successfully!",
    });
  }
};

const editPost = async (post) => {
  editedPost.value = post;
  isEditing.value = true;
  showModal.value = true;
  title.value = post.title;
  content.value = post.content;
  category_id.value = { label: post.category.name, value: post.category.id };
  tags.value = post.tags.map((tag) => ({ label: tag.name, value: tag.id }));
  type.value = post.type === 'paid';
  imagePreview.value = `${image_url}/${post.image}`;
  // const newName = prompt('Enter new name', Post.name);
  // if (newName) {
  //   await newService.updatePost(Post.id, {name: newName});
  //   await fetchPosts();
  //   notify({
  //     title: "Post",
  //     text: "Post updated successfully!",
  //   });
  // }
};

const handleClose = () => {
  console.log('Modal closed')
  resetForm();
}

const fetchPosts = async (page) => {
  loading.value = true;
  const queryString = {
    limit: limit.value,
    page: page || pagination.value.current_page,
  }
  const response = await newService.getPosts(queryString);
  posts.value = response.data.data;
  pagination.value = {
    current_page: response.data.current_page,
    last_page: response.data.last_page,
    total: response.data.total,
  };
  loading.value = false;
}

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  image.value = file;

  if (!file) {
    console.error('No file selected');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result; // Set the preview value
    console.log(e.target.result); // Log the base64 encoded image
  };

  reader.readAsDataURL(file); // Read the file as a data URL
};

const resetForm = () => {
     title.value = "";
     category_id.value = null;
     tags.value = [];
     image.value = null;
     imagePreview.value = null;
     content.value = "";
     type.value = false;
     isEditing.value = false;
     editedPost.value = null;
     showModal.value = false;
     
    }

</script>
