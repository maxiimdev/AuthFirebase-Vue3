<script setup lang="ts">
interface Props {
  message: string;
}

defineProps<Props>();
defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <div
    class="fixed z-100 top-4 right-4 bg-red-600 text-white rounded-lg shadow-lg p-4 max-w-sm w-full animate-slide-in"
  >
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-lg font-semibold">Ошибка</h3>
        <p class="text-sm mt-1">{{ message }}</p>
      </div>
      <button
        @click="$emit('close')"
        class="ml-4 text-white hover:text-gray-200 transition"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Анимация выезда справа */
.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Анимация для Vue Transition */
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>