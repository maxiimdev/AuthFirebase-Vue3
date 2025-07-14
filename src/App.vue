<script setup lang="ts">
import Header from './components/Header.vue'
import { onMounted, ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useUserStore } from '@/stores/user'
import AppLoader from './components/AppLoader.vue'

const userStore = useUserStore()

const isLoading = ref<boolean>(true)

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      userStore.userId = user.uid
    } else {
      userStore.userId = ''
    }
    isLoading.value = false
  })
})
</script>

<template>
  <AppLoader v-if="isLoading" />
  <div v-else>
    <Header />

    <RouterView />
  </div>
</template>
