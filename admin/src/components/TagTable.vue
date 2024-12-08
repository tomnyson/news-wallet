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
            <td>{{ tag }}</td>
            <td>
              <button class="btn btn-danger btn-sm" @click="removeTag(index)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <input type="text" v-model="newTag" placeholder="New Tag" class="form-control mb-2" />
      <button class="btn btn-primary" @click="addTag">Add Tag</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        tags: ['Tag 1', 'Tag 2'],
        newTag: '',
      };
    },
    methods: {
      addTag() {
        if (this.newTag.trim()) {
          this.tags.push(this.newTag.trim());
          this.newTag = '';
        }
      },
      removeTag(index) {
        this.tags.splice(index, 1);
      },
    },
  };
  </script>
  