<script setup lang="ts">
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { useRouter } from 'vue-router'
import { GoogleAuthProvider } from 'firebase/auth'

import { computed, ref } from 'vue'
import AppLoader from '../components/AppLoader.vue'
import AppNotificationError from '../components/AppNotificationError.vue'
import { useNotification } from '../../composables/useNotification'

const { isNotificationOpen, errorMessage, openNotification } = useNotification()

const email = ref<string>('')
const password = ref<string>('')
const router = useRouter()
const provider = new GoogleAuthProvider()

const isLogin = ref<boolean>(true)
const isLoading = ref<boolean>(false)
const isEmail = ref<boolean>(false)

const subtitleText = computed<string>(() => {
  return isLogin.value ? "Don't have an account?" : 'Already have an account?'
})

const linkAccountText = computed<string>(() => {
  return isLogin.value ? 'Create one now' : 'Sign in'
})

const submitButtonText = computed<string>(() => {
  return isLogin.value ? 'Sign In' : 'Sign Up'
})

const toggleAuth = () => (isLogin.value = !isLogin.value)

const validateForm = (): boolean => {
  if (!email.value || !password.value) {
    openNotification('Please fill in all fields')
    return false
  }
  if (password.value.length < 6) {
    openNotification('Password must be at least 6 characters long')
    return false
  }
  return true
}

const submitFormEmail = async (): Promise<void> => {
  if (!validateForm()) return
  isLoading.value = true

  try {
    const auth = getAuth()
    auth.languageCode = 'en'
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value)
    } else {
      await createUserWithEmailAndPassword(auth, email.value, password.value)
    }
    router.push('/home')
  } catch (error: unknown) {
    if (error instanceof Error) {
      openNotification(error.message)
    }
  } finally {
    isLoading.value = false
  }
}

const goEmail = () => {
  isEmail.value = true
}
const goBack = () => {
  isEmail.value = false
}

const submitFormGoogle = async (): Promise<void> => {
  isLoading.value = true

  try {
    const auth = getAuth()
    auth.languageCode = 'en'
    await signInWithPopup(auth, provider)
    router.push('/home')
  } catch (error: unknown) {
    if (error instanceof Error) {
      openNotification(error.message)
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <transition name="fade">
    <AppNotificationError v-if="isNotificationOpen" :message="errorMessage" />
  </transition>

  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center p-4">
    <AppLoader v-if="isLoading" />

    <main v-else class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
        <div class="text-center mb-8">
          <h3 class="text-4xl font-bold tracking-tight">
            <span class="text-blue-600">Auth</span>Firebase
          </h3>
          <p v-if="!isEmail" class="text-gray-600 mt-2 text-lg">Welcome! Choose your sign-in method:</p>
        </div>

        <div v-if="isEmail" class="space-y-6">
          <div class="text-center text-gray-500">
            <span>{{ subtitleText }}</span>
            <button
              class="text-blue-600 hover:text-blue-800 font-medium ml-2 transition-colors"
              @click="toggleAuth"
            >
              {{ linkAccountText }}
            </button>
          </div>

          <form @submit.prevent="submitFormEmail" class="space-y-4">
            <div>
              <label for="email1" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                v-model="email"
                type="email"
                id="email1"
                class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label for="password1" class="block text-sm font-medium text-gray-700">Password</label>
              <input
                v-model="password"
                type="password"
                id="password1"
                class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <span class="pi pi-user"></span>
              <span>{{ submitButtonText }}</span>
            </button>

            <button
              @click="goBack"
              class="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <span class="pi pi-arrow-left"></span>
              <span>Back</span>
            </button>
          </form>
        </div>

        <div v-else class="space-y-4">
          <button
            @click="goEmail"
            class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <span class="pi pi-user"></span>
            <span>Email | Password</span>
          </button>
          <button
            @click="submitFormGoogle"
            class="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <span class="pi pi-google"></span>
            <span>Google</span>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>