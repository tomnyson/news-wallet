<template>
  <div class="container">
    <h2>Post List</h2>
    <!-- Form to create a post -->
    <div class="card mb-4">
      <div class="card-header">
        <h4>Create Post</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="createPost">
          <div class="mb-3">
            <label for="title" class="form-label">Title</label>
            <input
              type="text"
              id="title"
              v-model="newPost.title"
              class="form-control"
              placeholder="Enter post title"
              required
            />
          </div>

          <div class="mb-3">
            <label for="content" class="form-label">Content</label>
            <Editor
               v-model="newPost.content"
              api-key="j16t3n51cam680u6a2ixha4eqgxu4rxa17g4ea37dexqbclh"
              :init="{
        plugins: 'lists link image table code help wordcount'
      }"
            />
          </div>

          <div class="mb-3">
            <label for="category" class="form-label">Category</label>
            <select id="category_id" v-model="newPost.category_id" class="form-control">
              <option value="">Select a category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label for="tags" class="form-label">Tags</label>
            <select id="tag" v-model="newPost.tags" class="form-control" multiple>
              <option value="">Select a tags</option>
              <option mul v-for="tag in tags" :key="tag.id" :value="tag.id">
                {{ tag.name }}
              </option>
            </select>
            <div class="mt-2">
              <span v-for="(tag, index) in newPost.tags" :key="index" class="badge bg-primary me-2">
                {{ tag }}
                <button
                  type="button"
                  class="btn-close btn-close-white ms-2"
                  aria-label="Remove"
                  @click="removeTag(index)"
                ></button>
              </span>
            </div>
          </div>

          <div class="mb-3">
            <label for="image" class="form-label">Upload Image</label>
            <input type="file" id="image" class="form-control" @change="handleImageUpload" />
          </div>

          <div class="mb-3 form-check">
            <input type="checkbox" id="isPaid" class="form-check-input" v-model="newPost.isPaid" />
            <label for="isPaid" class="form-check-label"> Paid Content </label>
          </div>

          <button type="submit" class="btn btn-primary">Create Post</button>
        </form>
      </div>
    </div>

    <!-- Table to display posts -->
    <div class="card">
      <div class="card-header">
        <h4>Posts</h4>
      </div>
      <div class="card-body">
        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Category</th>
              <th>Tags</th>
              <th>Image</th>
              <th>Content Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(post, index) in posts" :key="post.id">
              <td>{{ index + 1 }}</td>
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
                  width="200"
                />
              </td>
              <td><span :class="['badge me-2', post.type == 'paid' ? 'bg-success': 'bg-primary']">{{ post.type }}</span></td>
              <td>
                <button class="btn btn-info btn-sm" @click="viewPost(post)">View</button>
                <button class="btn btn-warning btn-sm mx-2" @click="editPost(post)">Edit</button>
                <button class="btn btn-danger btn-sm" @click="deletePost(post.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import newService from "@/services/NewService";
import Editor from '@tinymce/tinymce-vue'
import { notify } from "@kyvg/vue3-notification";
// OR | AND

const editorModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"], // Formatting options
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"], // Insert options
    ["clean"], // Remove formatting
  ],
};

const posts = ref([]);
const categories = ref([]);
const tags = ref([]);
const newPost = ref({
  title: "",
  content: "",
  category_id: "",
  tags: [],
  image: null,
  isPaid: false,
});
const newTag = ref("");
const image_url = process.env.VUE_APP_STATIC_URL  || 'http://localhost:8000/storage';
onMounted(async () => {
  const responseCategories = await newService.getCategories();
  const responseTags = await newService.getTags();
  tags.value = responseTags.data;
  categories.value = responseCategories.data;
  const responsePosts = await newService.getPosts();
  posts.value = responsePosts.data;
});


const handleImageUpload = (event) => {
  const file = event.target.files[0];
  newPost.value.image = file; // Attach the file
};

const createPost = async () => {
  try {
    const formData = new FormData();
    formData.append("title", newPost.value.title);
    formData.append("content", newPost.value.content);
    formData.append("category_id", newPost.value.category_id);
    newPost.value.tags.forEach((tag) => formData.append("tags[]", tag));
    if (newPost.value.image) {
      formData.append("image", newPost.value.image);
    }
    formData.append("type", newPost.value.isPaid ? 'paid' : 'free');

    const response = await newService.addPost(formData);
    const responsePost = await newService.getPosts();
    posts.value = responsePost.data;
    alert("Post created successfully!");
  } catch (error) {
    console.error(error.response.data);
    alert("Error creating post.");
  }
};

const addTag = () => {
  if (newTag.value && !newPost.value.tags.includes(newTag.value)) {
    newPost.value.tags.push(newTag.value);
    newTag.value = ""; // Reset tag input
  }
};

const removeTag = (index) => {
  newPost.value.tags.splice(index, 1);
};

const viewPost = (post) => {
  alert(`Viewing post: ${post.title}`);
};

const editPost = (post) => {
  const updatedTitle = prompt("Edit title:", post.title);
  const updatedContent = prompt("Edit content:", post.content);
  if (updatedTitle !== null && updatedContent !== null) {
    post.title = updatedTitle;
    post.content = updatedContent;
  }
};

const deletePost = async(id) => {
  if (confirm(`Are you sure you want to delete ${id}?`)) {
    await newService.deletePost(id);
    const response = await newService.getPosts();
    notify({
      title: "Post",
      text: "Post deleted successfully!",
    });
    posts.value = response.data;
  }

};
</script>

<style scoped>
  .ql-container {
  height: 300px;
}
</style>
