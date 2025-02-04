Copy

<template>
  <div class="relative min-h-screen flex items-center justify-center">
    <!-- Fondo con overlay rojo para mejor contraste -->
    <div class="absolute inset-0 bg-red-900/60 backdrop-blur-sm"></div>
    <NuxtImg
      src="/images/log.jpg"
      alt="Tienda Background"
      class="absolute inset-0 w-full h-full object-cover"
      quality="80"
      format="webp"
      loading="eager"
    />

    <!-- Contenido del formulario -->
    <div class="container mx-auto p-6 flex flex-col items-center relative z-10">
      <!-- Título con efecto neón -->
      <h1 class="text-4xl md:text-5xl font-bold mb-8 text-white neon-red">
        RT Virtual
      </h1>

      <!-- Tarjeta de formulario -->
      <div class="w-full max-w-md bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl p-8 transform transition-all hover:shadow-3xl">
        <form @submit.prevent="login" class="space-y-6">
          <!-- Campo Usuario -->
          <div>
            <label class="block text-sm font-semibold text-red-700 mb-2">Usuario</label>
            <div class="relative">
              <input 
                v-model="nombre_usuario" 
                type="text" 
                required
                class="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-300 transition-all placeholder-red-400"
                placeholder="Tu correo único"
              >
              <svg class="absolute right-3 top-3.5 h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
          </div>

          <!-- Campo Contraseña -->
          <div>
            <label class="block text-sm font-semibold text-red-700 mb-2">Contraseña</label>
            <div class="relative">
              <input 
                v-model="password" 
                type="password" 
                required
                class="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-300 transition-all placeholder-red-400"
                placeholder="****"
              >
              <svg class="absolute right-3 top-3.5 h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
          </div>

          <!-- Botón Login -->
          <button type="submit" class="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3.5 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 transition-all duration-300">
            Unirse
          </button>

          <!-- Mensaje error -->
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            ⚠️ {{ error }}
          </div>
        </form>

        <!-- Registro moderno -->
        <div class="mt-8 text-center">
          <p class="text-gray-600 text-sm mb-2">¿Aún no formas parte de la experiencia?</p>
          <NuxtLink 
            to="/register" 
            class="inline-flex items-center space-x-2 text-red-600 hover:text-red-800 font-semibold transition-colors group"
          >
            <span>Únete Ahora</span>
            <svg class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { definePageMeta } from '#imports';
import { useRuntimeConfig } from '#app';

const { signIn, token } = useAuth();

const nombre_usuario = ref('');
const password = ref('');
const error = ref('');
const config = useRuntimeConfig();

const login = async () => {
  try {
    const response = await signIn(
      { email: nombre_usuario.value, password: password.value },
      { callbackUrl: "/", redirect: true }
    );

  } catch (err) {
    console.error('Error durante el inicio de sesión:', err); // Muestra el error completo
    error.value = err?.response?.data?.message || 'Credenciales inválidas. Por favor, verifica tus datos.';
  }
};

definePageMeta({
  layout: 'auth',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  },
});
</script>

<style scoped>
/* Estilos adicionales si los necesitas */
.neon-red {
  text-shadow: 0 0 10px rgba(220, 38, 38, 0.8), 
                0 0 20px rgba(220, 38, 38, 0.6),
                0 0 30px rgba(220, 38, 38, 0.4);
}

.backdrop-blur-lg {
  backdrop-filter: blur(12px);
}

.shadow-3xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>