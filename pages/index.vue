<template>
  <div class="relative min-h-screen w-full flex items-center justify-center p-4">
    <!-- Imagen de fondo -->
    <NuxtImg
      src="/images/inventario.jpg"
      alt="Inventario Background"
      class="absolute inset-0 w-full h-full object-cover"
      quality="80"
      format="webp"
      loading="eager"
    />

    <!-- Contenido principal -->
    <section class="text-center relative z-10">
      <h1 >
        Productos
      </h1>
      <ProductList />
    </section>
  </div>
</template>

<script setup>
// No necesitas importar la imagen manualmente, NuxtImg la maneja automáticamente
</script>

<style scoped>
/* Estilos adicionales si los necesitas */
</style>