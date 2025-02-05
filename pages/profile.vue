<template>
    <div class="relative min-h-screen w-full flex items-center justify-center p-4">
      <NuxtImg
        src="/images/inventario.jpg"
        alt="Inventario Background"
        class="absolute inset-0 w-full h-full object-cover"
        quality="80"
        format="webp"
        loading="eager"
      />
  
      <section class="text-center relative z-10 max-w-6xl mx-auto w-full">
        <h1 class="mb-6 md:mb-10
                  text-3xl 
                  sm:text-4xl 
                  md:text-5xl 
                  lg:text-6xl 
                  xl:text-7xl
                  font-extrabold
                  tracking-tighter
                  drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
                  transition-transform
                  duration-300
                  hover:scale-105
                  bg-gradient-to-r
                  from-red-400
                  via-red-500
                  to-red-600
                  text-transparent
                  bg-clip-text
                  animate-text-shine">
          Mi Perfil
        </h1>
  
        <div class="max-w-4xl mx-auto px-4">
          <!-- Encabezado del perfil -->
          <div class="bg-white/90 backdrop-blur-sm rounded-lg p-6 mb-8 shadow-lg">
            <div class="flex flex-col sm:flex-row items-center space-x-4">
              <div class="bg-red-500 rounded-full w-16 h-16 flex items-center justify-center mb-4 sm:mb-0">
                <span class="text-2xl text-white font-medium">{{ userInitials }}</span>
              </div>
              <div class="text-center sm:text-left">
                <h2 class="text-xl text-gray-800 font-semibold">{{ userData.username }}</h2>
                <p class="text-red-600 font-medium">{{ userData.rol }}</p>
              </div>
            </div>
          </div>
  
          <!-- Información del usuario -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Detalles del perfil -->
            <div class="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <h3 class="text-xl font-bold text-red-600 mb-6 border-b pb-2">Detalles del Perfil</h3>
              <form @submit.prevent="updateProfile" class="space-y-4">
                <div>
                  <label class="block text-gray-700 mb-2 font-medium">Nombre de Usuario</label>
                  <input
                    v-model="formData.username"
                    type="text"
                    class="w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-200
                          focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-gray-700 mb-2 font-medium">Email</label>
                  <input
                    v-model="formData.email"
                    type="email"
                    class="w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-200
                          focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-gray-700 mb-2 font-medium">Número de Teléfono</label>
                  <input
                    v-model="formData.phone_number"
                    type="tel"
                    class="w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-200
                          focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Ingresa tu número de contacto"
                  />
                </div>
                <button
                  type="submit"
                  class="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg 
                        font-medium transition-colors duration-300"
                  :disabled="isUpdating"
                >
                  {{ isUpdating ? 'Actualizando...' : 'Guardar Cambios' }}
                </button>
              </form>
            </div>
  
            <!-- Seguridad -->
            <div class="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <h3 class="text-xl font-bold text-red-600 mb-6 border-b pb-2">Seguridad</h3>
              
              <div class="mb-8">
                <h4 class="text-lg text-gray-800 mb-4 font-medium">Cambiar Contraseña</h4>
                <form @submit.prevent="updatePassword" class="space-y-4">
                  <div>
                    <input
                      v-model="passwordData.currentPassword"
                      type="password"
                      placeholder="Contraseña actual"
                      class="w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-200
                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      v-model="passwordData.newPassword"
                      type="password"
                      placeholder="Nueva contraseña"
                      class="w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-200
                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      v-model="passwordData.confirmPassword"
                      type="password"
                      placeholder="Confirmar nueva contraseña"
                      class="w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-200
                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    class="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg 
                          font-medium transition-colors duration-300"
                    :disabled="isUpdatingPassword"
                  >
                    {{ isUpdatingPassword ? 'Actualizando...' : 'Cambiar Contraseña' }}
                  </button>
                </form>
              </div>
              
              <Twofactorsetup
                @status-change="handle2FAStatusChange"
                @notification="handle2FANotification"
              />
            </div>
          </div>
  
          <!-- Notificación -->
          <div
            v-if="notification.show"
            class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg border"
            :class="{
              'bg-green-100 border-green-200 text-green-800': notification.type === 'success',
              'bg-red-100 border-red-200 text-red-800': notification.type === 'error'
            }"
          >
            <p class="font-medium flex items-center gap-2">
              <span v-if="notification.type === 'success'">✓</span>
              <span v-else>⚠️</span>
              {{ notification.message }}
            </p>
          </div>
        </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';
import Twofactorsetup from '~/components/user/Twofactorsetup.vue';

const config = useRuntimeConfig();
const { token, data: userData } = useAuth();

const formData = ref({
    username: '',
    email: '',
    phone_number: ''
});

const passwordData = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});

const isUpdating = ref(false);
const isUpdatingPassword = ref(false);
const notification = ref({
    show: false,
    message: '',
    type: 'success'
});

const userInitials = computed(() => {
    if (!userData.value?.username) return '';
    return userData.value.username.substring(0, 2).toUpperCase();
});

watchEffect(() => {
    if (userData.value) {
        formData.value = {
            username: userData.value.username || '',
            email: userData.value.email || '',
            phone_number: userData.value.phone_number || ''
        };
    }
});

const showNotification = (message, type = 'success') => {
    notification.value = {
        show: true,
        message,
        type
    };
        setTimeout(() => {
        notification.value.show = false;
    }, 3000);
};

const updateProfile = async () => {
    try {
        isUpdating.value = true;
        await $fetch(`${config.public.BACKEND_URL}/CheckpointReviews/usuarios/editUsuario/${userData.value.id}`, {
        method: 'PUT',
        body: formData.value,
        headers: {
        'Authorization': token.value
        }
    });
    showNotification('Perfil actualizado exitosamente');
    } catch (error) {
    showNotification(error.message || 'Error al actualizar el perfil', 'error');
    } finally {
    isUpdating.value = false;
    }
};


const updatePassword = async () => {
    if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    showNotification('Las contraseñas no coinciden', 'error');
    return;
    }

    try {
    isUpdatingPassword.value = true;
    await $fetch(`${config.public.BACKEND_URL}/api/user/edit-usuario/${userData.value.id}`, {
        method: 'PUT',
        body: {
        password: passwordData.value.newPassword,
        currentPassword: passwordData.value.currentPassword
        },
        headers: {
        'Authorization': token.value
        }
    });

    showNotification('Contraseña actualizada exitosamente');
    passwordData.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };
    } catch (error) {
    console.error('Error completo:', error);
    showNotification(
        error.data?.message || 'Error al actualizar la contraseña', 
        'error'
    );
    } finally {
    isUpdatingPassword.value = false;
    }
};



const handle2FAStatusChange = () => {
    showNotification('Estado de 2FA actualizado exitosamente');
};

const handle2FANotification = (message, type) => {
    showNotification(message, type);
};
</script>
    