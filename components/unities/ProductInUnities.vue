<template>
    <div class="bg-gray-800 p-6 rounded-lg">
    <h2 class="text-2xl text-red-500 mb-4">Productos de la Unidad</h2>
    <ul class="text-gray-400">
        <li v-for="product in products" :key="product.id" class="flex justify-between items-center mb-2">
        <span>{{ product.desc_prod }} - ${{ product.price }}({{ product.h_much }}-{{ product.unit }})</span>
        <button @click="deleteProduct(product.id)" class="bg-red-600 text-white py-1 px-2 rounded-lg hover:bg-red-700 transition">
            Eliminar
        </button>
        </li>
    </ul>
    <div class="flex justify-between mt-6">
        <button @click="$emit('close')" class="bg-red-400 text-white py-2 px-4 rounded-lg hover:bg-red-500 transition">
            Cerrar
        </button>
    </div>
    </div>
</template>

<script setup>
const props = defineProps({
    products: Array 
});

const emit = defineEmits(['close', 'add']);

// Función para eliminar un producto
const deleteProduct = (productId) => {
  emit('delete', productId); // Emitir el evento de eliminar con el ID del producto
};
// Función para agregar un producto
const addProduct = () => {
  emit('add', newProduct.value); // Emitir el evento con el nuevo producto
  newProduct.value = { desc_prod: '', price: 0 }; // Limpiar el formulario
};


</script>

<style scoped>
  /* Puedes agregar estilos adicionales aquí si es necesario */
</style>