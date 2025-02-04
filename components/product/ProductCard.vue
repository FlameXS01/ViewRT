<template>
  <div class="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full border-t-4 border-red-500">
    <!-- Contenedor de imagen ajustado -->
    <div class="relative h-48 bg-red-50 overflow-hidden">
      <NuxtImg
        v-if="prodImageURL"
        :src="prodImageURL"
        :alt="product.desc_prod"
        class="w-full h-full object-cover absolute inset-0"
        width="320"
        height="192"
        format="webp"
        loading="lazy"
        fit="cover"
      />
      <div v-else class="flex items-center justify-center h-full text-red-200">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </div>
    </div>

    <!-- Contenido del card -->
    <div class="p-4 flex-1 flex flex-col bg-red">
      <div class="mb-3">
        <div class="flex justify-between items-start gap-2">
          <h3 class="text-lg font-bold text-gray-800 truncate">{{ product.desc_prod }}</h3>
          <span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">{{ product.cod_prod }}</span>
        </div>
        <div class="text-sm text-gray-600 mt-1 truncate">
          <span class="inline-block w-4">📍</span> {{ product.cod_ub }}
        </div>
      </div>

      <!-- Sección de precios -->
      <div class="grid grid-cols-2 gap-3 mb-4 items-end">
        <div class="text-center p-2 bg-red-50 rounded-lg">
          <p class="text-xs text-gray-600 mb-1">Precio</p>
          <p class="text-lg font-bold text-red-600 leading-tight">{{ formatPrice(product.price) }}</p>
        </div>
        <div class="text-center p-2 bg-gray-100 rounded-lg">
          <p class="text-xs text-gray-600 mb-1">Existencia</p>
          <p :class="['text-lg font-bold leading-tight', product.h_much > 0 ? 'text-green-600' : 'text-red-600']">
            {{ product.h_much }}<span class="text-xs ml-1 text-gray-500">{{ product.unit }}</span>
          </p>
        </div>
      </div>

      <!-- Unidades asociadas -->
      <div v-if="product.unityIds?.length" class="mb-3 flex-1 overflow-y-auto">
        <p class="text-xs text-gray-500 mb-2 font-medium">Unidades asociadas:</p>
        <div class="flex flex-wrap gap-2">
          <span v-for="(unit, index) in product.unityIds" :key="index" 
                class="px-2.5 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
            {{ unit }}
          </span>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="pt-3 border-t border-gray-200 mt-auto" v-if="showP">
        <div class="flex justify-between items-center">
          <div class="flex gap-2">
            <button 
              @click="editProduct"
              class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Editar producto"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
            </button>
            <button 
              @click="deleteProduct"
              class="p-2 text-gray-500 hover:text-white hover:bg-red-600 rounded-lg transition-all"
              title="Eliminar producto"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRuntimeConfig } from '#imports';
const { data } = useAuth();
const userRole = computed(() => data.value?.rol);  
const showP = computed(() => userRole.value === 'administrador');    

const config = useRuntimeConfig();
const props = defineProps({
  product: Object
});

const emit = defineEmits(['edit', 'delete']);

const prodImageURL = computed(() => {
  if (!props.product?.url_imagen) {
    return null;
  }
  return `${config.public.BACKEND_URL}/api/p/imagen/${props.product.url_imagen}`;
});

const editProduct = () => {
  emit('edit', props.product);
};

const deleteProduct = () => {
  if (confirm(`¿Estás seguro de eliminar: ${props.product.desc_prod}?`)) {
    emit('delete', props.product.id);
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(price);
};
</script>

<style scoped>
/* Puedes agregar estilos adicionales aquí si es necesario */
</style>