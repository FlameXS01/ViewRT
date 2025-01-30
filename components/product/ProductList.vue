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
      Agregar Producto
    </button>

    <!-- Grid responsivo mejorado -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :title="product.desc_prod"
        :description="`Precio: $${product.price}`"
        :image="product.url_imagen"
        :product="product"
        @edit="editProduct"
        @add="addProduct"
        @delete="deleteProduct"
      />
    </div>

    <!-- Modal responsivo -->
    <Modal v-if="showForm" @close="showForm = false">
      <div class="w-full max-w-[95%] md:max-w-2xl mx-auto">
        <ProductForm 
          :product="selectedProduct" 
          @close="showForm = false" 
          @refresh="fetchProducts" 
        />
      </div>
    </Modal>

    <!-- Mensaje de error mejorado -->
    <p 
      v-if="errorMessage" 
      class="text-red-600 text-center mt-4 px-4 py-2 bg-red-50 rounded-lg border border-red-200 max-w-md mx-auto"
    >
      {{ errorMessage }}
    </p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProductCard from '~/components/product/ProductCard.vue';
import ProductForm from '~/components/product/ProductForm.vue';
import Modal from '~/components/Modal.vue'; 

const config = useRuntimeConfig();
const { data } = useAuth();
const products = ref([]);
const showForm = ref(false);
const selectedProduct = ref(null);
const errorMessage = ref(''); // Estado para el mensaje de error

const isAdmin = ref(false); // Estado para verificar si el usuario es administrador

const fetchProducts = async () => {
  try {
    products.value = await $fetch(`${config.public.BACKEND_URL}/api/p/get-productos`);
    isAdmin.value = data.value?.rol === 'administrador'; // Verificar si el usuario es administrador
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    errorMessage.value = 'No se pudieron cargar los productos. Intenta de nuevo más tarde.';
  }
};

const editProduct = (product) => {
  selectedProduct.value = product;
  showForm.value = true;
};

const addProduct = () => {
  selectedProduct.value = null; // Restablecer el producto seleccionado
  showForm.value = true; // Mostrar el formulario
};

const deleteProduct = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este producto?')) return;  
  try {
    await $fetch(`${config.public.BACKEND_URL}/api/p/del-productos/${id}`, { method: 'DELETE' });
    fetchProducts();
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    errorMessage.value = 'No se pudo eliminar el producto. Intenta de nuevo.' ;
  };
};

onMounted(fetchProducts);
</script>

