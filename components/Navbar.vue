<template>
  <nav :class="mobile ? 'bg-red-700' : 'bg-red-800 p-4'">
    <div :class="mobile ? 'block' : 'max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8'">
      <ul :class="mobile ? 'space-y-1' : 'flex items-center justify-end space-x-8'">
        <!-- Productos -->
        <li v-if="showProducts">
          <NuxtLink 
            to="/products" 
            :class="mobile ? 
              'flex items-center px-4 py-3 space-x-3 text-red-50 hover:bg-red-600/90 transition-colors rounded-lg' : 
              'flex items-center space-x-2 text-red-100 hover:text-white group transition-colors'"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <span class="font-medium">Productos</span>
          </NuxtLink>
        </li>

        <!-- Unidades -->
        <li v-if="showUnits">
          <NuxtLink 
            to="/units" 
            :class="mobile ? 
              'flex items-center px-4 py-3 space-x-3 text-red-50 hover:bg-red-600/90 transition-colors rounded-lg' : 
              'flex items-center space-x-2 text-red-100 hover:text-white group transition-colors'"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <span class="font-medium">Unidades</span>
          </NuxtLink>
        </li>

        <!-- Usuarios -->
        <li v-if="showUsers">
          <NuxtLink 
            to="/users" 
            :class="mobile ? 
              'flex items-center px-4 py-3 space-x-3 text-red-50 hover:bg-red-600/90 transition-colors rounded-lg' : 
              'flex items-center space-x-2 text-red-100 hover:text-white group transition-colors'"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <span class="font-medium">Usuarios</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
const { data, status } = useAuth();

const userRole = computed(() => data.value?.rol);
const props = defineProps({
  mobile: Boolean
});

const showProducts = computed(() => status.value === 'authenticated');
const showUnits = computed(() => userRole.value === 'administrador');
const showUsers = computed(() => userRole.value === 'administrador');
</script>

<style scoped>

</style>