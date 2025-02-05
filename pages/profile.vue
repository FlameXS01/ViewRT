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
  
      <section class="text-center relative z-10 max-w-6xl mx-auto">
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
                  from-amber-300
                  via-orange-400
                  to-red-600
                  text-transparent
                  bg-clip-text
                  animate-text-shine">
          Mi Perfil
        </h1>
  
        <div class="max-w-4xl mx-auto">
          <!-- Encabezado del perfil -->
          <div class="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
            <div class="flex items-center space-x-4">
              <div class="bg-orange-500 rounded-full p-4">
                <span class="text-2xl text-white">{{ userInitials }}</span>
              </div>
              <div>
                <h2 class="text-xl text-white font-semibold">{{ userData.username }}</h2>
                <p class="text-gray-400">{{ userData.rol }}</p>
              </div>
            </div>
          </div>
  
          <!-- Información del usuario -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Detalles del perfil -->
            <div class="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 class="text-xl font-bold text-orange-500 mb-6">Detalles del Perfil</h3>
              <form @submit.prevent="updateProfile" class="space-y-4">
                <div>
                  <label class="block text-gray-300 mb-2">Nombre de Usuario</label>
                  <input
                    v-model="formData.username"
                    type="text"
                    class="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none 
                            focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label class="block text-gray-300 mb-2">Email</label>
                  <input
                    v-model="formData.email"
                    type="email"
                    class="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none 
                            focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  class="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-400 
                          transition duration-300"
                  :disabled="isUpdating"
                >
                  {{ isUpdating ? 'Actualizando...' : 'Actualizar Perfil' }}
                </button>
              </form>
            </div>
  
            <!-- Seguridad -->
            <div class="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 class="text-xl font-bold text-orange-500 mb-6">Seguridad</h3>
              <div class="mb-8">
                <h4 class="text-lg text-white mb-4">Cambiar Contraseña</h4>
                <form @submit.prevent="updatePassword" class="space-y-4">
                  <div>
                    <input
                      v-model="passwordData.currentPassword"
                      type="password"
                      placeholder="Contraseña actual"
                      class="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none 
                              focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <input
                      v-model="passwordData.newPassword"
                      type="password"
                      placeholder="Nueva contraseña"
                      class="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none 
                              focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <input
                      v-model="passwordData.confirmPassword"
                      type="password"
                      placeholder="Confirmar nueva contraseña"
                      class="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none 
                              focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <button
                    type="submit"
                    class="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-400 
                            transition duration-300"
                    :disabled="isUpdatingPassword"
                  >
                    {{ isUpdatingPassword ? 'Actualizando...' : 'Cambiar Contraseña' }}
                  </button>
                </form>
              </div>
              <!-- 2FA Setup -->
              <Twofactorsetup
                @status-change="handle2FAStatusChange"
                @notification="handle2FANotification"
              />
            </div>
          </div>
        </div>
  
        <!-- Notificación -->
        <div
          v-if="notification.show"
          class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg"
          :class="{
            'bg-green-500': notification.type === 'success',
            'bg-red-500': notification.type === 'error'
          }"
        >
          <p class="text-white">{{ notification.message }}</p>
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
    email: ''
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
            email: userData.value.email || ''
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
    