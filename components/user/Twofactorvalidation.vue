<template>
    <div class="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-200">
      <h2 class="text-2xl font-bold text-red-600 mb-6 
                bg-gradient-to-r from-red-500 to-red-600 
                text-transparent bg-clip-text">
        Verificación de Dos Factores
      </h2>
      
      <div class="mb-6">
        <p class="text-gray-700 mb-4">
          Ingresa el código de verificación de tu aplicación de autenticación:
        </p>
        <input
          v-model="code"
          type="text"
          placeholder="Código de 6 dígitos"
          class="w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-200
                 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                 placeholder-gray-400 mb-4"
          @keyup.enter="validate"
        />
        <button
          @click="validate"
          class="w-full bg-red-500 text-white py-2.5 px-4 rounded-lg hover:bg-red-600 
                transition-colors duration-300 font-medium"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Verificando...' : 'Confirmar Código' }}
        </button>
      </div>
  
      <div v-if="error" class="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
        <p class="text-red-600 text-sm font-medium flex items-center gap-2">
          <span>⚠️</span>
          {{ error }}
        </p>
      </div>
    </div>
  </template>
    
    <script setup>
    import { ref } from 'vue';

    const emit = defineEmits(['validated']);
    const config = useRuntimeConfig();
    const { token } = useAuth();

    const code = ref('');
    const isLoading = ref(false);
    const error = ref(null);

    const validate = async () => {
    try {
        isLoading.value = true;
        error.value = null;
        
        const response = await $fetch(`${config.public.BACKEND_URL}/api/user/2fa/validate`, {
        method: 'POST',
        body: {
            code: code.value
        },
        headers: {
            'Authorization': token.value
        }
        });

        if (response.valid) {
        emit('validated', true);
        } else {
        error.value = 'Código inválido';
        }
    } catch (err) {
        error.value = 'Error al validar el código';
        console.error('Error:', err);
    } finally {
        isLoading.value = false;
    }
};
</script>
