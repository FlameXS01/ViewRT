<template>
  <div class="bg-gray-800 p-6 rounded-lg text-center">
    <h3 class="text-2xl text-red-500 mb-4">{{ unity_name }}</h3>
    <p class="text-gray-400">Complejo: {{ complex }}</p>
    <p class="text-gray-400">Centro de Costo: {{ cost_center }}</p>
    <div class="mt-4 ">
      <button @click="editUnity" class="bg-red-400 text-white py-2 px-6 rounded-lg hover:bg-red-500 transition mr-2">
        Editar
      </button>
      <button @click="deleteUnity" class="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition">
        Eliminar
      </button>
      <button @click="handleViewProducts" class="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition mt-4">
        Manejar Productos
      </button>
    </div>
    <!-- <div class="mt-4">
      <h4 class="text-lg text-white">Productos:</h4>
      <ul class="text-gray-400">
        <li v-for="product in products" :key="product.id">
          {{ product.desc_prod }} - {{ product.price }} {{ product.unit }}
        </li>
      </ul>
    </div> -->
  </div>
</template>

<script setup>
const props = defineProps({
  unity_name: String,
  complex: String,
  cost_center: String,
  products: Array,
  unity: Object // Propiedad para el objeto de la unidad
});

const emit = defineEmits(['edit', 'delete', 'viewProducts', 'addProduct']);

const handleViewProducts = () => {
  emit('viewProducts', props.unity.id); // Emitir el evento con el ID de la unidad
};
const editUnity = () => {
  emit('edit', props.unity);
};

const deleteUnity = () => {
  emit('delete', props.unity.id); // Usar id como identificador
};
</script>

<style scoped>
/* Puedes agregar estilos adicionales aquí si es necesario */
</style>