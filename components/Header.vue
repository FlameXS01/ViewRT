<template>
  <header class="bg-red-800 sticky top-0 z-50 shadow-lg" ref="headerRef">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Desktop Header -->
      <div class="hidden md:flex items-center justify-between h-16">
        <!-- Logo y Nombre -->
        <div class="flex-shrink-0 flex items-center space-x-3">
          <NuxtImg
            src="/images/logo.png"
            format="webp"
            alt="RT Virtual shop logo"
            width="48"
            height="48"
            class="rounded-md transform hover:scale-105 transition-transform"
          />
          <h1 class="text-2xl text-red-100 font-bold tracking-tight">RT Virtual</h1>
        </div>

        <!-- Navbar + Botón cerrar sesión -->
        <div class="flex-1 flex items-center justify-between ml-8">
          <Navbar />
          <button
            v-if="isAuthenticated"
            @click="handleSignOut"
            class="text-red-100 hover:text-white p-2 rounded-full transition-colors relative group"
            title="Cerrar sesión"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-red-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Cerrar sesión
            </span>
          </button>
        </div>
      </div>

      <!-- Mobile Header -->
      <div class="md:hidden flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center space-x-3">
          <NuxtImg
            src="/images/logo.png"
            format="webp"
            alt="RT Virtual shop logo"
            width="40"
            height="40"
            class="rounded-md"
          />
          <h1 class="text-xl text-red-100 font-bold">RT Virtual</h1>
        </div>

        <!-- Botones derecho -->
        <div class="flex items-center space-x-4">
          <button
            v-if="isAuthenticated"
            @click="handleSignOut"
            class="text-red-100 hover:text-white p-2"
            title="Cerrar sesión"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
          
          <button
            @click="toggleMenu"
            class="text-red-100 hover:text-white p-2 focus:outline-none"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Menú Móvil Desplegable -->
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-show="isOpen" class="md:hidden absolute w-full bg-red-700 left-0 px-4 pb-4 shadow-xl">
          <div class="pt-2 space-y-1">
            <Navbar mobile />
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const { signOut, status, data } = useAuth();
const isOpen = ref(false);
const headerRef = ref(null);

const isAuthenticated = computed(() => status.value === 'authenticated');

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const handleClickOutside = (event) => {
  if (headerRef.value && !headerRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

const handleSignOut = async () => {
  try {
    isOpen.value = false;
    await signOut({ callbackUrl: '/login' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>