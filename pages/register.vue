<template>
  <div class="relative min-h-screen flex items-center justify-center">
    <!-- Overlay para contraste -->
    <div class="absolute inset-0 bg-red-900/70 backdrop-blur-sm"></div>
    
    <NuxtImg
      src="/images/registro.jpg"
      alt="Registro Background"
      class="absolute inset-0 w-full h-full object-cover"
      quality="80"
      format="webp"
      loading="eager"
    />

    <!-- Contenido principal -->
    <div class="container mx-auto p-6 flex flex-col items-center relative z-10">
      <!-- Título con efecto dinámico -->
      <h1 class="text-4xl md:text-5xl font-bold mb-8 text-white neon-red transform hover:scale-105 transition duration-300">
        <span class="bg-gradient-to-r from-red-400 via-red-300 to-red-200 bg-clip-text text-transparent">
          Únete a la Experiencia
        </span>
      </h1>

      <!-- Tarjeta de formulario -->
      <div class="w-full max-w-2xl bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 transform transition-all hover:shadow-3xl">
        <UserForm class="space-y-6" />
        
        <!-- Enlace a Login -->
        <div class="mt-8 text-center">
          <p class="text-gray-600 text-sm mb-2">¿Ya tienes una cuenta?</p>
          <NuxtLink 
            to="/login" 
            class="inline-flex items-center space-x-2 text-red-600 hover:text-red-800 font-semibold transition-colors group"
          >
            <svg class="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span>Accede a tu Cuenta</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  auth: {
    unauthenticatedOnly: true,    // Solo permite acceso a NO autenticados
    navigateAuthenticatedTo: '/'  // Redirige usuarios autenticados a la home
  }
});
</script>

<style scoped>
/* Estilos adicionales si los necesitas */
.neon-red {
  text-shadow: 0 0 15px rgba(239, 68, 68, 0.6),
                0 0 30px rgba(239, 68, 68, 0.4),
                0 0 45px rgba(239, 68, 68, 0.2);
}

.backdrop-blur-lg {
  backdrop-filter: blur(12px);
}

.shadow-3xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
}
</style>