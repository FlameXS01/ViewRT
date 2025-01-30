<template>
  <div class="max-h-screen overflow-y-auto p-6">
    <form @submit.prevent="submitForm" class="bg-gray-800 text-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 class="text-2xl font-bold mb-4 text-center">{{ unity ? 'Editar Unidad' : 'Agregar Unidad' }}</h2>
      
      <label class="block mb-2">Nombre de la Unidad</label>
      <input v-model="form.unity_name" type="text" required class="p-2 border rounded-lg w-full mb-4" placeholder="Ingresa el nombre de la unidad" style="color: black;" />
      
      <label class="block mb-2">Complejo</label>
      <input v-model="form.complex" type="text" required class="p-2 border rounded-lg w-full mb-4" placeholder="Ingresa el complejo" style="color: black;" />
      
      <label class="block mb-2">Centro de Costo</label>
      <input v-model="form.cost_center" type="text" required class="p-2 border rounded-lg w-full mb-4" placeholder="Ingresa el centro de costo" style="color: black;" />

      <!-- <label class="block mb-2">Productos</label> -->
      <!-- <div class="mb-4">
        <div v-if="products.length === 0" class="text-gray-400">Cargando productos...</div>
        <div v-else>
          <div v-for="product in products" :key="product.id" class="flex items-center mb-2">
            <input
              type="checkbox"
              :value="product.id"
              v-model="form.productIds"
              class="mr-2"
            />
            <label class="text-white">{{ product.desc_prod }}</label>
          </div>
        </div>
      </div> -->

      <button type="submit" class="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition w-full">
        {{ unity ? 'Actualizar Unidad' : 'Agregar Unidad' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const config = useRuntimeConfig();

const props = defineProps({
  unity: Object,
  products: Array // Lista de productos para seleccionar
});

const emit = defineEmits(['close', 'refresh']);

const form = ref({
  unity_name: '',
  complex: '',
  cost_center: '',
  productIds: []
});

// Rellena el formulario si se está editando una unidad
watch(() => props.unity, (newUnity) => {
  if (newUnity) {
  form.value = { 
      unity_name: newUnity.unity_name || '',
      complex: newUnity.complex || '',
      cost_center: newUnity.cost_center || '',
      productIds: newUnity.products.map(product => product.id) || []
    };
  }
});

// Función para enviar el formulario
const submitForm = async () => {
  try {
    if (props.unity) {
      // Actualizar unidad
      const id = props.unity.id;
      await $fetch(`${config.public.BACKEND_URL}/api/u/edit-unidades/${id}`, {
        method: 'PUT',
        body: form.value,
      });
    } else {
      // Agregar nueva unidad
      await $fetch(`${config.public.BACKEND_URL}/api/u/add-unidades`, {
        method: 'POST',
        body: form.value,
      });
    }
    emit('refresh');
    emit('close');
  } catch (error) {
    console.error('Error al guardar la unidad:', error);
    // Aquí puedes agregar un mensaje de error para el usuario
  }
};
</script>