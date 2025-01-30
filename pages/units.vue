<template>
  <div class="relative min-h-screen w-full flex items-center justify-center p-4">
    <NuxtImg
      src="/images/unity.jpg"
      alt="Registro Background"
      class="absolute inset-0 w-full h-full object-spectrum"
      quality="80"
      format="webp"
      loading="eager"
    />

    <section class="text-center relative z-10 max-w-6xl mx-auto">
      <h1 class="mb-6 md:mb-10
                text-3xl 
                sm:text-4xl 
                md:text-5xl 
                lg:text-6xl 
                xl:text-7xl
                font-extrabold
                tracking-tighter
                drop-shadow-lg
                transition-transform
                duration-300
                hover:scale-105
                bg-gradient-to-r
                from-blue-700
                via-red-500
                to-blue-800
                text-transparent
                bg-clip-text
                animate-text-shine">
        Unidades
      </h1>
      <UnitiesList />
    </section>
  </div>
</template>

<script setup>
// No necesitas importar la imagen manualmente, NuxtImg la maneja automáticamente
</script>

<style scoped>
/* Estilos adicionales si los necesitas */
</style>