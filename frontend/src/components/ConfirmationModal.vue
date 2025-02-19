<template>
    <div v-if="isVisible" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all">
        <div class="p-6">
          <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full" :class="iconClass">
            <component :is="icon" class="w-6 h-6" />
          </div>
          
          <h3 class="text-lg font-medium text-center text-gray-900 mb-2">
            {{ title }}
          </h3>
          
          <p class="text-sm text-center text-gray-500 mb-6">
            {{ message }}
          </p>
          
          <div class="flex justify-end space-x-3">
            <button
              @click="onCancel"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              @click="onConfirm"
              class="px-4 py-2 text-sm font-medium text-white rounded-lg hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2"
              :class="confirmButtonClass"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    isVisible: Boolean,
    title: String,
    message: String,
    type: {
      type: String,
      default: 'danger',
      validator: (value) => ['danger', 'warning'].includes(value)
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    }
  });
  
  const emit = defineEmits(['confirm', 'cancel']);
  
  const iconClass = computed(() => ({
    'bg-red-100 text-red-600': props.type === 'danger',
    'bg-amber-100 text-amber-600': props.type === 'warning'
  }));
  
  const confirmButtonClass = computed(() => ({
    'bg-red-600 hover:bg-red-700 focus:ring-red-500': props.type === 'danger',
    'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500': props.type === 'warning'
  }));
  
  const icon = computed(() => ({
    template: props.type === 'danger' 
      ? '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>'
      : '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9.401-3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>'
  }));
  
  const onConfirm = () => emit('confirm');
  const onCancel = () => emit('cancel');
  </script>