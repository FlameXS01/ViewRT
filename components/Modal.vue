<template>
    <div class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50" @click="$emit('close')"></div>
      <div class="bg-transparent rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
        <div class="p-6">
          <slot></slot>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineEmits(['close']);
  </script>
  
  <style scoped>
  /* Estilos adicionales para el modal */
  </style>