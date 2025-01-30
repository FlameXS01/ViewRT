<template>
  <div class="max-h-screen overflow-y-auto p-6">
    <form @submit.prevent="submitForm" class="bg-gray-800 text-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
    
      <h2 class="text-2xl font-bold mb-4 text-center">{{ product ? 'Editar Producto' : 'Agregar Producto' }}</h2>
      
      <label class="block mb-2">Nombre del Producto</label>
      <input v-model="form.desc_prod" type="text" required class="p-2 border rounded-lg w-full mb-4" placeholder="Ingresa el nombre" style="color: black;" />
      
      <label class="block mb-2">Código de Producto</label>
      <input v-model="form.cod_prod" type="text" required class="p-2 border rounded-lg w-full mb-4" placeholder="Ingresa el código del producto" style="color: black;" />
      
      <label class="block mb-2">Código de Ubicación</label>
      <input v-model="form.cod_ub" type="text" required class="p-2 border rounded-lg w-full mb-4" placeholder="Ingresa el código de ubicación" style="color: black;" />

      <label class="block mb-2">Precio</label>
      <input v-model="form.price" type="number" required class="p-2 border rounded-lg w-full mb-4" placeholder="Ingresa el precio" style="color: black;" />
      
      <div class="flex space-x-4 mb-4">
        <div class="flex-1">
          <label class="block mb-2">Cantidad</label>
          <input v-model="form.h_much" type="number" required class="p-2 border rounded-lg w-full" placeholder="Ingresa la cantidad" style="color: black;" />
        </div>
        <div class="flex-1">
          <label class="block mb-2">Métrica</label>
          <input v-model="form.unit" type="text" required class="p-2 border rounded-lg w-full" placeholder="Unidad de medida" style="color: black;" />
        </div>
      </div>

      <label class="block mb-2">Unidades</label>
      <div class="mb-4">
        <div v-if="units.length === 0" class="text-gray-400">Cargando unidades...</div>
        <div v-else>
          <div v-for="unit in units" :key="unit.id" class="flex items-center mb-2">
            <input
              type="checkbox"
              :value="unit.id"
              v-model="form.unityIds"
              class="mr-2"
            />
            <label class="text-white">{{ unit.unity_name }}</label>
          </div>
        </div>
      </div>

      <label class="block mb-2">Imagen del producto</label>
      <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg hover:border-orange-500 transition-colors duration-300">
        <div class="space-y-1 text-center">
          <label for="imagen" class="relative cursor-pointer rounded-md font-medium text-orange-500 hover:text-orange-400 focus-within:outline-none">
            <span>Subir imagen</span>
            <input 
              id="imagen" 
              type="file" 
              class="sr-only" 
              @change="handleFileUpload"
              accept="image/*"
            />
          </label>
          <p class="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
        </div>
      </div>

      <div v-if="form.url_imagen" class="mb-4">
        <img :src="form.url_imagen" class="max-w-xs h-auto mx-auto rounded-full" alt="Vista previa de la imagen" />
      </div>

      <button type="submit" class="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition w-full">
        {{ product ? 'Actualizar Producto' : 'Agregar Producto' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  product: Object,
});
const config = useRuntimeConfig();
const errorMessage = ref(null);
const selectedFile = ref(null);
const units = ref([]);
const { data } = useAuth();
const emit = defineEmits(['close', 'refresh']);

const form = ref({
  cod_prod: '',
  cod_ub: '',
  desc_prod: '',
  price: 0,
  h_much: 0,
  unit: '',
  unityIds: [],
  url_imagen: '',
});

// Corregir en el watch:
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    form.value = { 
      cod_prod: newProduct.cod_prod,
      cod_ub: newProduct.cod_ub,
      desc_prod: newProduct.desc_prod,
      price: newProduct.price,
      h_much: newProduct.h_much,
      unit: newProduct.unit,
      unityIds: newProduct.unityIds || [], 
      url_imagen: newProduct.url_imagen 
        ? `${config.public.BACKEND_URL}/api/p/imagen/${newProduct.url_imagen}`
        : ''
    };
  } else {
    form.value = {  
      cod_prod: '',
      cod_ub: '',
      desc_prod: '',
      price: 0,
      h_much: 0,
      unit: '',
      unityIds: [], 
      url_imagen: ''
    }
  }
}, {immediate: true, deep: true}); 


const fetchUnits = async () => {
  try {
    const response = await $fetch(`${config.public.BACKEND_URL}/api/u/get-unidades`);
    units.value = response.map(unit => ({
      id: unit.id,
      unity_name: unit.unity_name
    }));
  } catch (error) {
    console.error('Error al obtener las unidades:', error);
  }
};

onMounted(() => {
  fetchUnits();
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  selectedFile.value = file;
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Forzar actualización de la vista
      form.value.url_imagen = e.target.result;
      form.value = {...form.value}; // Esto reactiva la actualización
    };
    reader.readAsDataURL(file);
  } else {
    // Restaurar imagen original si se cancela la selección
    form.value.url_imagen = props.user?.url_imagen 
      ? `${config.public.BACKEND_URL}/api/p/imagen/${props.product.url_imagen}`
      : '';
  }
};


const submitForm = async () => {
  errorMessage.value = null;
  try {
    const formData = new FormData();
    
    // Agregar todos los campos individualmente
    formData.append('cod_ub', form.value.cod_ub);
    formData.append('cod_prod', form.value.cod_prod);
    formData.append('desc_prod', form.value.desc_prod);
    formData.append('h_much', form.value.h_much);
    formData.append('unit', form.value.unit);
    formData.append('price', form.value.price);
    
    // Para arrays, agregar cada elemento individualmente
    form.value.unityIds.forEach((id, index) => {
      formData.append(`unityIds[${index}]`, id);
    });

    if (selectedFile.value) {
      formData.append('imagen', selectedFile.value);
    }

    // Verificar contenido real del FormData
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const baseUrl = config.public.BACKEND_URL;
    const url = props.product 
      ? `${baseUrl}/api/p/edit-productos/${props.product.id}`
      : `${baseUrl}/api/p/add-productos`;

    const response = await fetch(url, {
      method: props.product ? 'PUT' : 'POST',
      headers: {
        'Authorization': `Bearer ${data.value?.token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la solicitud');
    }

    // Manejo de la respuesta exitosa
    const result = await response.json();
    
    // Actualizar la URL de la imagen con la respuesta del servidor
    if (result.url_imagen) {
      form.value.url_imagen = `${baseUrl}/api/p/imagen/${result.url_imagen}`;
    }

    // Forzar actualización de la vista
    form.value = { ...form.value };

    emit('refresh');
    emit('close');
  } catch (error) {
    errorMessage.value = error.message;
    // Limpiar archivo temporal si hay error
    if (selectedFile.value) {
      URL.revokeObjectURL(form.value.url_imagen);
      selectedFile.value = null;
      form.value.url_imagen = props.user?.url_imagen 
        ? `${config.public.BACKEND_URL}/api/p/imagen/${props.product.url_imagen}`
        : '';
    }
  }
};
</script>