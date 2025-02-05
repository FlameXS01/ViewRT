<template>
    <div class="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 class="text-xl font-bold text-orange-500 mb-4">Autenticación de Dos Factores</h3>
        
        <div v-if="!twoFactorEnabled">
        <p class="text-gray-300 mb-4">
            Escanea el código QR con Google Authenticator o una aplicación similar:
        </p>
        <div v-if="qrCode" class="mb-4 flex justify-center">
            <img 
            :src="qrCode" 
            alt="QR Code" 
            class="max-w-[200px] h-auto"
            />
        </div>
            <div v-if="!qrCode" class="mb-4 text-gray-400">
            Cargando código QR...
        </div>
        <div class="mb-4">
            <label class="block text-gray-300 text-sm font-medium mb-2">
            Código de verificación
            </label>
            <input
            v-model="verificationCode"
            type="text"
            placeholder="Ingresa el código de 6 dígitos"
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white 
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
        </div>
        <button
            @click="verifyAndEnable"
            class="w-full bg-orange-500 text-white py-3 rounded-lg font-medium 
                    hover:bg-orange-600 transition-all"
            :disabled="isLoading || !verificationCode"
        >
            {{ isLoading ? 'Verificando...' : 'Activar 2FA' }}
        </button>
        </div>

        <div v-else>
        <div class="flex items-center mb-4">
            <span class="text-orange-400 mr-2">✓</span>
            <p class="text-gray-300">2FA está activado</p>
        </div>
        <button
            @click="disable2FA"
            class="w-full bg-red-500 text-white py-3 rounded-lg font-medium 
                    hover:bg-red-600 transition-all"
            :disabled="isLoading"
        >
            {{ isLoading ? 'Desactivando...' : 'Desactivar 2FA' }}
        </button>
        </div>

        <div v-if="error" class="mt-4 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
        <p class="text-red-500 text-sm">{{ error }}</p>
        </div>
    </div>
    </template>
    
    <script setup>
    import { ref, onMounted } from 'vue';

    const config = useRuntimeConfig();
    const { token } = useAuth();

    const qrCode = ref(null);
    const secret = ref(null);
    const verificationCode = ref('');
    const twoFactorEnabled = ref(false);
    const isLoading = ref(false);
    const error = ref(null);

    const emit = defineEmits(['status-change', 'notification']);

    const checkStatus = async () => {
    try {
        
        const response = await $fetch(`${config.public.BACKEND_URL}/api/user/2fa/status`, {
        headers: {
            'Authorization': token.value.startsWith('Bearer ') 
            ? token.value 
            : `Bearer ${token.value}`,
            'Content-Type': 'application/json'
        }
        });

      console.log('Respuesta status:', response); // Debug de la respuesta
        twoFactorEnabled.value = response.enabled;

        if (!twoFactorEnabled.value) {
        await generateQR();
        }
    } catch (err) {
        console.error('Error completo:', err);
        error.value = 'Error al verificar estado 2FA';
        emit('notification', 'Error al verificar estado 2FA', 'error');
    }
    };

    const generateQR = async () => {
    try {
    
        isLoading.value = true;
        error.value = null;
        
        const response = await $fetch(`${config.public.BACKEND_URL}/api/user/2fa/generate`, {
        method: 'POST',
        headers: {
            'Authorization': token.value.startsWith('Bearer ') 
            ? token.value 
            : `Bearer ${token.value}`,
            'Content-Type': 'application/json'
        }
        });


        qrCode.value = response.qrCode;
        secret.value = response.secret;
    } catch (err) {
        console.error('Error completo al generar QR:', err);
        error.value = 'Error al generar el código QR';
        emit('notification', 'Error al generar el código QR', 'error');
    } finally {
        isLoading.value = false;
    }
    };


    const verifyAndEnable = async () => {   
    if (!verificationCode.value) return;
    
    try {
        isLoading.value = true;
        error.value = null;
    
        console.log('Enviando código:', verificationCode.value);
        console.log('Secret:', secret.value);

        const response = await $fetch(`${config.public.BACKEND_URL}/api/user/2fa/verify`, {
            method: 'POST',
            body: {
                code: verificationCode.value,
                secret: secret.value
            },
            headers: {
            'Authorization': token.value.startsWith('Bearer ') 
                ? token.value 
                : `Bearer ${token.value}`
            }
        });

        if (response.success) {
            twoFactorEnabled.value = true;
            verificationCode.value = '';
        } else {
            error.value = 'Código inválido';
        }
    } catch (err) {
    error.value = 'Error al verificar el código';
    console.error('Error:', err);
    } finally {
    isLoading.value = false;
    } 
};

const disable2FA = async () => {
    try {
    isLoading.value = true;
    error.value = null;

    await $fetch(`${config.public.BACKEND_URL}/api/user/2fa/disable`, {
        method: 'POST',
        headers: {
        'Authorization': token.value.startsWith('Bearer ') 
            ? token.value 
            : `Bearer ${token.value}`
        }
    });

    twoFactorEnabled.value = false;
    await generateQR();
    } catch (err) {
    error.value = 'Error al desactivar 2FA';
    console.error('Error:', err);
    } finally {
    isLoading.value = false;
    }
};

onMounted(async () => {
    await checkStatus();
});
</script>
