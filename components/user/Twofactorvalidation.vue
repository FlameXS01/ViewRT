<template>
    <div class="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 class="text-2xl font-bold text-orange-500 mb-6">Verificación de Dos Factores</h2>
        
        <div class="mb-6">
        <p class="text-gray-300 mb-4">
            Ingresa el código de verificación de tu aplicación de autenticación:
        </p>
        <input
            v-model="code"
            type="text"
            placeholder="Código de 6 dígitos"
            class="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-orange-500 mb-4"
            @keyup.enter="validate"
        />
        <button
            @click="validate"
            class="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-400 
                    transition duration-300"
            :disabled="isLoading"
        >
            {{ isLoading ? 'Verificando...' : 'Verificar' }}
        </button>
        </div>

        <div v-if="error" class="mt-4 p-4 bg-red-500 bg-opacity-20 rounded-lg">
        <p class="text-red-500">{{ error }}</p>
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
