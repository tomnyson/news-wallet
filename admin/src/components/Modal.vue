<template>
    <Teleport to="body">
      <div 
        v-if="modelValue" 
        class="modal-overlay"
        @click.self="closeModal"
      >
        <div 
          class="modal-container" 
          :class="[sizeClass, modalClass]"
          role="dialog"
          aria-modal="true"
        >
          <div class="modal-header">
            <slot name="header">
              <h3 v-if="title" class="modal-title">{{ title }}</h3>
            </slot>
            <button 
              v-if="showCloseButton" 
              class="modal-close-btn" 
              @click="closeModal"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
  
          <div class="modal-body">
            <slot>
              <p v-if="content">{{ content }}</p>
            </slot>
          </div>
  
          <div v-if="$slots.footer || showDefaultActions" class="modal-footer">
            <slot name="footer">
              <button 
                v-if="showDefaultActions" 
                class="btn btn-secondary" 
                @click="closeModal"
              >
                Cancel
              </button>
              <button 
                v-if="showDefaultActions" 
                class="btn btn-primary" 
                @click="confirmModal"
              >
                Confirm
              </button>
            </slot>
          </div>
        </div>
      </div>
    </Teleport>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  // Props definition with defaults
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large', 'full'].includes(value)
    },
    showCloseButton: {
      type: Boolean,
      default: true
    },
    showDefaultActions: {
      type: Boolean,
      default: false
    },
    modalClass: {
      type: String,
      default: ''
    }
  })
  
  // Emits definition
  const emit = defineEmits([
    'update:modelValue', 
    'close', 
    'confirm'
  ])
  
  // Computed size class
  const sizeClass = computed(() => {
    switch(props.size) {
      case 'small': return 'modal-sm'
      case 'large': return 'modal-lg'
      case 'full': return 'modal-full'
      default: return 'modal-md'
    }
  })
  
  // Methods to handle modal interactions
  const closeModal = () => {
    emit('update:modelValue', false)
    emit('close')
  }
  
  const confirmModal = () => {
    emit('confirm')
    emit('update:modelValue', false)
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-container {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 90%;
    width: 500px;
    position: relative;
  }
  
  .modal-sm { width: 300px; }
  .modal-md { width: 500px; }
  .modal-lg { width: 800px; }
  .modal-full { 
    width: 90%;
    height: 90%;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    padding: 15px;
    border-top: 1px solid #e0e0e0;
  }
  
  .modal-close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }
  
  .btn {
    padding: 8px 16px;
    margin-left: 10px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btn-secondary {
    background-color: #6c757d;
    color: white;
  }
  
  .btn-primary {
    background-color: #007bff;
    color: white;
  }
  </style>