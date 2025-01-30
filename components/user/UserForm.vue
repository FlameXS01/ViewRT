<template>
  <div class="max-h-screen overflow-y-auto overflow-x-hidden p-6">
    <form @submit.prevent="submitForm" class="bg-gray-800 text-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 class="text-2xl font-bold mb-4 text-center text-red-400">{{ user ? 'Editar Usuario' : 'Crear Nueva Cuenta' }}</h2>

      <!-- Mensaje de error -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-600/90 text-white rounded-lg text-sm backdrop-blur-sm">
        ⚠️ {{ errorMessage }}
      </div>

      <!-- Campo Nombre -->
      <div class="mb-6">
        <label class="block mb-2 text-sm font-medium text-red-300">Nombre Completo</label>
        <input 
          v-model="form.username" 
          type="text" 
          required 
          class="w-full px-4 py-3 bg-gray-700 border border-red-500/30 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all placeholder-gray-400"
          placeholder="Ej: Juan Pérez"
        />
      </div>

      <!-- Campo Contraseña -->
      <div class="mb-6">
        <label class="block mb-2 text-sm font-medium text-red-300">Contraseña</label>
        <div class="relative">
          <input 
            v-model="form.password" 
            :type="showPassword ? 'text' : 'password'" 
            :required="!user" 
            class="w-full px-4 py-3 bg-gray-700 border border-red-500/30 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all placeholder-gray-400"
            :placeholder="user ? 'Dejar vacío para no cambiar' : 'Mínimo 8 caracteres'"
          />
          <button 
            type="button" 
            @click="showPassword = !showPassword" 
            class="absolute right-3 top-3.5 text-red-400 hover:text-red-300 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Campo Email -->
      <div class="mb-6">
        <label class="block mb-2 text-sm font-medium text-red-300">Correo Electrónico</label>
        <input 
          v-model="form.email" 
          type="email" 
          required 
          class="w-full px-4 py-3 bg-gray-700 border border-red-500/30 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all placeholder-gray-400"
          placeholder="example@domain.com"
        />
      </div>

      <!-- Campo Teléfono -->
      <div class="mb-6">
        <label class="block mb-2 text-sm font-medium text-red-300">Teléfono</label>
        <input 
          v-model="form.phone_number" 
          type="number" 
          required
          class="w-full px-4 py-3 bg-gray-700 border border-red-500/30 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all placeholder-gray-400"
          placeholder="Ej: 3101234567"
          @input="validatePhoneNumber"
        />
        <p v-if="phoneError" class="text-red-400 text-xs mt-1">{{ phoneError }}</p>
      </div>

      <!-- Campo Rol -->
      <div class="mb-6">
        <label class="block mb-2 text-sm font-medium text-red-300">Rol del Usuario</label>
        <select 
          v-model="form.rol" 
          class="w-full px-4 py-3 bg-gray-700 border border-red-500/30 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all appearance-none"
          required
        >
          <option 
            v-for="role in roles" 
            :key="role.value" 
            :value="role.value"
            class="bg-gray-800"
          >
            {{ role.name }}
          </option>
        </select>
      </div>

      <!-- Upload de Imagen -->
      <div class="mb-8">
        <label class="block mb-2 text-sm font-medium text-red-300">Imagen de Perfil</label>
        <div class="relative group">
          <div class="flex justify-center px-6 pt-5 pb-6 border-2 border-red-500/30 border-dashed rounded-lg hover:border-red-400 transition-colors cursor-pointer">
            <div class="text-center">
              <label class="cursor-pointer">
                <span class="text-red-400 hover:text-red-300 transition-colors">
                  {{ form.url_imagen ? 'Cambiar imagen' : 'Subir imagen' }}
                </span>
                <input 
                  type="file" 
                  class="sr-only" 
                  @change="handleFileUpload"
                  accept="image/*"
                />
              </label>
              <p class="mt-1 text-xs text-gray-400">Formatos: PNG, JPG, GIF (Max 10MB)</p>
            </div>
          </div>
        </div>
        
        <!-- Vista previa imagen -->
        <div v-if="form.url_imagen" class="mt-4">
          <img 
            :src="form.url_imagen" 
            class="w-32 h-32 mx-auto rounded-full object-cover border-2 border-red-500/50"
            alt="Vista previa"
          />
        </div>
      </div>

      <!-- Botón Submit -->
      <button 
        type="submit" 
        class="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
      >
        {{ user ? 'Actualizar Usuario' : 'Crear Cuenta' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRuntimeConfig, useAuth } from '#imports';
import { navigateTo } from '#app';

const props = defineProps({ user: Object });
const emit = defineEmits(['close', 'refresh']);
const config = useRuntimeConfig();
const { data } = useAuth();
const showPassword = ref(false);
const errorMessage = ref(null);
const selectedFile = ref(null);
const isAdminContext = computed(() => data.value?.rol === 'administrador');

const phoneError = ref(null);

const validatePhoneNumber = () => {
  const phone = form.value.phone_number.replace(/[^\d]/g, '');
  if (phone.length !== 12) {
    phoneError.value = 'El teléfono no debe tener 12 dígitos';
  } else {
    phoneError.value = null;
    form.value.phone_number = phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  }
};

const form = ref({
  username: '',
  phone_number: '',
  password: '',
  email: '', 
  rol: 'usuario',
  url_imagen: '',
});

const roles = ref([
  { id: 1, name: 'Usuario', value: 'usuario' },
  ...(data.value?.rol === 'administrador' ? [{ id: 2, name: 'Administrador', value: 'administrador' }] : [])
]);

watch(() => props.user, (newUser ) => {
  if (newUser ) {
    form.value = { 
      username: newUser .username,
      phone_number: newUser .phone_number,
      email: newUser .email,
      password: '',
      rol: newUser .rol,
      url_imagen: newUser.url_imagen 
        ? `${config.public.BACKEND_URL}/api/user/imagen/${newUser.url_imagen}`
        : ''
    };
  } else {
    form.value = {
      username: '',
      phone_number: '',
      password: '',
      email: '',
      rol: 'usuario',
      url_imagen: ''
    };
  }
}, { immediate: true, deep: true });

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
      ? `${config.public.BACKEND_URL}/api/user/imagen/${props.user.url_imagen}`
      : '';
  }
};



const submitForm = async () => {
  errorMessage.value = null;

  try {
    if (!props.user && form.value.rol === 'administrador') {
      const confirmAdmin = window.confirm('¿Estás seguro de crear un usuario administrador?');
      if (!confirmAdmin) return;
    }

    const formData = new FormData();    
    formData.append('username', form.value.username);
    formData.append('email', form.value.email);
    formData.append('phone_number', form.value.phone_number);
    formData.append('rol', form.value.rol);
    
    if (form.value.password) {
      formData.append('password', form.value.password);
    }
    
    if (selectedFile.value) {
      formData.append('imagen', selectedFile.value);
    }

    const baseUrl = config.public.BACKEND_URL;
    const url = props.user 
      ? `${baseUrl}/api/user/edit-usuario/${props.user.id}`
      : `${baseUrl}/api/user/add-usuario`;


      
    const response = await fetch(url, {
      method: props.user ? 'PUT' : 'POST',
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
      form.value.url_imagen = `${baseUrl}/api/user/imagen/${result.url_imagen}`;
    }

    // Forzar actualización de la vista
    form.value = { ...form.value };

    emit('refresh');
    emit('close');

    // Lógica de redirección
    if (!isAdminContext.value && !props.user) {
      await navigateTo('/login');
    } else if (props.user && data.value?.id === props.user.id) {
      await navigateTo('/login');
    }

  } catch (error) {
    errorMessage.value = error.message;
    // Limpiar archivo temporal si hay error
    if (selectedFile.value) {
      URL.revokeObjectURL(form.value.url_imagen);
      selectedFile.value = null;
      form.value.url_imagen = props.user?.url_imagen 
        ? `${config.public.BACKEND_URL}/api/user/imagen/${props.user.url_imagen}`
        : '';
    }
  }
};
</script>

<style scoped>
/* Puedes agregar estilos personalizados aquí si es necesario */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ef4444'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.5em;
}
</style>