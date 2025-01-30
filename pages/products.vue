<template>
  <div class="relative min-h-screen w-full flex items-center justify-center p-4">
    <NuxtImg
      src="/images/inventario.jpg"
      alt="Inventario Background"
      class="absolute inset-0 w-full h-full object-cover"
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
                drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
                transition-transform
                duration-300
                hover:scale-105
                bg-gradient-to-r
                from-amber-300
                via-orange-400
                to-red-600
                text-transparent
                bg-clip-text
                animate-text-shine">
        Productos
      </h1>
      <ProductList />
    </section>
  </div>
</template>

<style scoped>
@keyframes text-shine {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.animate-text-shine {
  background-size: 200% auto;
  animation: text-shine 3s ease-in-out infinite alternate;
}
</style>
<script setup>
// No necesitas importar la imagen manualmente, NuxtImg la maneja automáticamente
</script>

<style scoped>
/* Estilos adicionales si los necesitas */
</style>