<template>
    <div 
        class="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center bg-gray-200"
        :style="{ backgroundImage: `url('${backgroundImage}')` }"
    >
        <section class="text-center max-w-6xl mx-auto">
            <h1 class="text-gray-800 font-bold mb-6 
                        text-3xl      /* Mobile first */
                        sm:text-4xl   /* ≥640px */
                        md:text-5xl   /* ≥768px */
                        lg:text-6xl   /* ≥1024px */
                        xl:text-7xl   /* ≥1280px */
                        drop-shadow-md
                        tracking-tight
                        transition-all duration-300
                        transform hover:scale-105
                        ">
                <span class="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                    Registro de 
                </span>
                <span class="block mt-2 sm:mt-3 md:mt-4 lg:mt-5 
                            text-2xl sm:text-3xl md:text-4xl lg:text-5xl
                            font-semibold text-gray-700">
                    Usuarios
                </span>
            </h1>
            <UserList />
        </section>
    </div>
</template>

<script setup>
import backgroundImage from '~/assets/images/users.jpg';
</script>

<style scoped>
  /* Estilos adicionales si los necesitas */
</style>