<template>
  <section class="p-4 sm:p-6">
    <!-- Botón mejorado con icono -->
    <button 
      v-if="isAdmin" 
      @click="showForm = true" 
      class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 md:py-3 md:px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 mb-6 mx-auto"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-5 w-5 md:h-6 md:w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M12 4v16m8-8H4"
        />
      </svg>
      Agregar Unidad
    </button>

    <!-- Grid responsivo mejorado -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <UnitiesCard
        v-for="unity in units"
        :key="unity.id"
        :unity_name="unity.unity_name"
        :complex="unity.complex"
        :cost_center="unity.cost_center"
        :products="unity.products"
        :unity="unity"
        @edit="editUnity"
        @delete="deleteUnity"
        @viewProducts="viewProducts"
      />
    </div>

    <!-- Modales responsivos -->
    <Modal v-if="showForm" @close="showForm = false">
      <div class="w-full max-w-[95%] md:max-w-xl mx-auto">
        <UnitiesForm 
          :unity="selectedUnity" 
          :products="products" 
          @close="showForm = false" 
          @refresh="fetchUnits" 
        />
      </div>
    </Modal>

    <Modal v-if="showProducts" @close="showProducts = false">
      <div class="w-full max-w-[95%] md:max-w-2xl mx-auto">
        <ProductInUnities 
          :products="selectedProducts"
          @close="showProducts = false"
          @delete="deleteProduct"
        />
      </div>
    </Modal>

    <!-- Mensaje de error mejorado -->
    <p 
      v-if="errorMessage" 
      class="text-red-600 text-center mt-4 px-4 py-2 bg-red-50 rounded-lg border border-red-200 max-w-md mx-auto text-sm md:text-base"
    >
      {{ errorMessage }}
    </p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import UnitiesCard from '~/components/unities/UnitiesCard.vue';
import UnitiesForm from '~/components/unities/UnitiesForm.vue';
import Modal from '~/components/Modal.vue'; 
import ProductInUnities from '~/components/unities/ProductInUnities.vue'; // Asegúrate de importar el componente


const config = useRuntimeConfig();
const { data } = useAuth();
const units = ref([]);
const products = ref([]); // Para almacenar la lista de productos
const showForm = ref(false);
const showProducts = ref(false);
const selectedUnity = ref(null);
const selectedTempUnity = ref(null);
const selectedProducts = ref([]);
const errorMessage = ref(''); // Estado para el mensaje de error

const isAdmin = ref(false); // Estado para verificar si el usuario es administrador

const showAddProductModal = (unityId) => {
  selectedTempUnity.value = unityId; // Guardar el ID de la unidad seleccionada
  showAddProduct.value = true; // Cambiar el estado para mostrar el modal
};
const fetchUnits = async () => {
  try {
    units.value = await $fetch(`${config.public.BACKEND_URL}/api/u/get-unidades`);
    isAdmin.value = data.value?.rol === 'administrador'; // Verificar si el usuario es administrador
  } catch (error) {
    console.error('Error al obtener las unidades:', error);
    errorMessage.value = 'No se pudieron cargar las unidades. Intenta de nuevo más tarde.';
  }
};

const editUnity = (unity) => {
  selectedUnity.value = unity;
  showForm.value = true;
};

const deleteUnity = async (id) => {
  try {
    await $fetch(`${config.public.BACKEND_URL}/api/u/del-unidades/${id}`, { method: 'DELETE' });
    fetchUnits();
  } catch (error) {
    console.error('Error al eliminar la unidad:', error);
    errorMessage.value = 'No se pudo eliminar la unidad. Intenta de nuevo.';
  }
};
const viewProducts = async (unityId) => {
  try {
    // Lógica para obtener los productos de la unidad seleccionada
    const response = await $fetch(`${config.public.BACKEND_URL}/api/u/get-prodByUnid/${unityId}`);
    selectedProducts.value = response; 
    showProducts.value = true;
    selectedTempUnity.value = unityId;
    console.log(selectedProducts) // Mostrar el modal con los productos
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    errorMessage.value = 'No se pudieron cargar los productos. Intenta de nuevo más tarde.';
  }
};
// Función para eliminar un producto
// Función para eliminar un producto
const deleteProduct = async (productId) => {
  try {
    // Obtener el ID de la unidad seleccionada
    const idU = selectedTempUnity.value; 
    await $fetch(`${config.public.BACKEND_URL}/api/p/del-productosInUnity/${productId}`, {
      method: 'DELETE',
      body: { idU } // Enviar el ID de la unidad en el cuerpo de la solicitud
    });
    // Actualiza la lista de productos después de eliminar
    selectedProducts.value = selectedProducts.value.filter(product => product.id !== productId);
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    errorMessage.value = 'No se pudo eliminar el producto. Intenta de nuevo.';
  }
};


onMounted(fetchUnits);
</script>