<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-900">
        <div class="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-lg">
        <div class="text-center">
            <h2 class="text-3xl font-bold text-green-400">Verificación 2FA</h2>
            <p class="mt-2 text-gray-400">
            Ingresa el código de verificación de tu aplicación autenticadora
            </p>
        </div>
        
        <form @submit.prevent="verifyCode" class="mt-8 space-y-6">
            <div>
            <label for="code" class="sr-only">Código 2FA</label>
            <input
                v-model="code"
                id="code"
                type="text"
                required
                class="appearance-none relative block w-full px-3 py-2 border border-gray-600 
                        placeholder-gray-400 text-white rounded-md focus:outline-none 
                        focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm 
                        bg-gray-700"
                placeholder="Ingresa el código de 6 dígitos"
                pattern="[0-9]*"
                inputmode="numeric"
                maxlength="6"
                :disabled="isLoading"
            />
            </div>

            <!-- Mensaje de error -->
            <div v-if="error" class="text-red-500 text-sm text-center mt-2">
            {{ error }}
            </div>

            <div>
            <button
                type="submit"
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent 
                        text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
                        disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isLoading || code.length !== 6"
            >
                <span v-if="isLoading">
                Verificando...
                </span>
                <span v-else>
                Verificar
                </span>
            </button>
            </div>
        </form>
        </div>
    </div>
    </template>
    
    <script setup>
    import { ref } from 'vue';
    import { useRouter, useAuth } from '#imports';

    const router = useRouter();
    const config = useRuntimeConfig();
    const { token } = useAuth();

    const code = ref('');
    const error = ref('');
    const isLoading = ref(false);

    definePageMeta({
    layout: 'auth',
    robots: {
        index: false,
        follow: false
    }
        });

    const verifyCode = async () => {
    if (isLoading.value || code.value.length !== 6) return;
    
    isLoading.value = true;
    error.value = '';
    
    try {
        const response = await $fetch(`${config.public.BACKEND_URL}/api/user/2fa/validate`, {
        method: 'POST',
        headers: {
            'Authorization': token.value,
            'Content-Type': 'application/json'
        },
        body: {
            code: code.value
        }
        });

        console.log('2FA validado correctamente');
        await router.push('/');

    } catch (err) {
        console.error('Error en la validación 2FA:', err);
        error.value = err.response?._data?.message || 'Código inválido. Por favor, intenta de nuevo.';
    } finally {
        isLoading.value = false;
    }
    };
</script>
