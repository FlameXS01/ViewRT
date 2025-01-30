<template>
  <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-red-900">
    <div class="relative">
      <!-- Encabezado con patrón sutil -->
      <div class="h-24 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZGYxZjEiLz48L3N2Zz4=')]">
        <div class="absolute inset-0 bg-gradient-to-b from-red-500 to-transparent"></div>
      </div>
      
      <!-- Avatar circular -->
      <div class="absolute -bottom-14 left-1/2 transform -translate-x-1/2">
        <div class="p-1 bg-white rounded-full shadow-lg border-2 border-red-100">
          <NuxtImg
            v-if="userImageURL"
            :src="userImageURL"
            alt="Imagen del usuario"
            class="w-28 h-28 object-cover rounded-full border-4 border-white"
            width="112"
            height="112"
            format="webp"
            lazy
          />
          <div v-else class="w-28 h-28 rounded-full bg-red-100 flex items-center justify-center">
            <svg class="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido -->
    <div class="pt-20 pb-6 px-6">
      <h3 class="text-2xl font-bold text-red-600 mb-2">{{ user.username }}</h3>
      <span class="inline-block text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full mb-4">
        {{ user.rol.toUpperCase() }}
      </span>

      <!-- Detalles en grid -->
      <div class="mt-4 space-y-3 text-sm">
        <div class="flex items-center">
          <span class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </span>
          <p class="text-gray-600 truncate">{{ user.email }}</p>
        </div>
        
        <div class="flex items-center">
          <span class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
          </span>
          <p class="text-gray-600">{{ user.phone_number || 'Sin teléfono' }}</p>
        </div>
      </div>

      <!-- Fecha de creación -->
      <div class="mt-6 pt-4 border-t border-red-50">
        <p class="text-xs text-gray-500 italic">
          Registrado el {{ formatDate(user.createdAt) }}
        </p>
      </div>

      <!-- Botones de acción -->
      <div class="mt-6 grid grid-cols-2 gap-3">
        <button 
          @click="editUser"
          class="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
          </svg>
          Editar
        </button>
        
        <button 
          @click="deleteUser"
          class="py-2 px-4 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          Eliminar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  user: Object
});

const emit = defineEmits(['edit', 'delete']);
const config = useRuntimeConfig();

const userImageURL = computed(() => {
  if (!props.user?.url_imagen) return null;
  return `${config.public.BACKEND_URL}/api/user/imagen/${props.user.url_imagen}`;
});

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const editUser = () => {
  emit('edit', props.user);
};

const deleteUser = () => {
  if (confirm(`¿Estás seguro de eliminar a ${props.user.username}?`)) {
    emit('delete', props.user.id);
  }
};
</script>