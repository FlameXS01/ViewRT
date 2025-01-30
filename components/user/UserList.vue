<template>
  <section class="p-4 sm:p-6">
    <!-- Botón con icono y diseño mejorado -->
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
      Agregar Usuario
    </button>

    <!-- Grid responsivo mejorado -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <UserCard
        v-for="user in users"
        :key="user.id"
        :user="user"
        @edit="editUser"
        @delete="deleteUser"
      />
    </div>

    <!-- Modal responsivo -->
    <Modal v-if="showForm" @close="showForm = false">
      <div class="w-full max-w-[95%] md:max-w-xl mx-auto p-4">
        <UserForm 
          :user="selectedUser" 
          @close="showForm = false" 
          @refresh="fetchUsers" 
        />
      </div>
    </Modal>

    <!-- Mensaje de error mejorado -->
    <p 
      v-if="errorMessage" 
      class="text-red-600 text-center mt-4 px-4 py-2 bg-red-50 rounded-lg border border-red-200 max-w-md mx-auto text-sm md:text-base"
    >
      {{ errorMessage }}
    </p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import UserCard from '~/components/user/UserCard.vue'; // Asegúrate de que la ruta sea correcta
import UserForm from '~/components/user/UserForm.vue'; // Asegúrate de que la ruta sea correcta
import Modal from '~/components/Modal.vue'; 

const config = useRuntimeConfig();
const { data } = useAuth();
const users = ref([]);
const showForm = ref(false);
const selectedUser  = ref(null);
const errorMessage = ref(''); // Estado para el mensaje de error

const isAdmin = ref(false); // Estado para verificar si el usuario es administrador

const fetchUsers = async () => {
  try {
    users.value = await $fetch(`${config.public.BACKEND_URL}/api/user/get-usuarios`);
    isAdmin.value = data.value?.rol === 'administrador'; // Verificar si el usuario es administrador
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    errorMessage.value = 'No se pudieron cargar los usuarios. Intenta de nuevo más tarde.';
  }
};

const editUser = (user) => {
  selectedUser.value = { ...user }; // Copia profunda para evitar mutaciones
  showForm.value = true;
};

// Resetear usuario seleccionado al cerrar modal
watch(showForm, (newVal) => {
  if (!newVal) {
    selectedUser.value = null;
  }
});
const deleteUser  = async (id) => {
  try {
    await $fetch(`${config.public.BACKEND_URL}/api/user/del-usuario/${id}`, { method: 'DELETE' });
    fetchUsers();
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    errorMessage.value = 'No se pudo eliminar el usuario. Intenta de nuevo.';
  }
};

onMounted(fetchUsers);
</script>

<style scoped>
/* Estilos opcionales */
</style>