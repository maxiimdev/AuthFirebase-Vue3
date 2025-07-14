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
  return isLogin.value ? 'Аккаунта еще нет?' : 'Уже есть аккаунт?'
})

const linkAccountText = computed<string>(() => {
  return isLogin.value ? 'Создайте сейчас' : 'Войдите в него'
})

const submitButtonText = computed<string>(() => {
  return isLogin.value ? 'Вход' : 'Регистрация'
})

const toggleAuth = () => (isLogin.value = !isLogin.value)

const validateForm = (): boolean => {
  if (!email.value || !password.value) {
    openNotification('Заполните все поля')
    return false
  }
  if (password.value.length < 6) {
    openNotification('Пароль должен содержать не менее 6 символов')
    return false
  }
  return true
}

const submitFormEmail = async (): Promise<void> => {
  if (!validateForm()) return
  isLoading.value = true

  try {
    const auth = getAuth()
    auth.languageCode = 'ru'
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
    auth.languageCode = 'ru'
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
  <transition>
    <AppNotificationError v-if="isNotificationOpen" :message="errorMessage" />
  </transition>

  <div class=" ">
    <AppLoader v-if="isLoading" />

    <main class="mt-30" v-else>
      <div class="flex flex-col mx-auto items-center justify-center">
        <div class="flex flex-col items-center pb-6">
          <h3 class="pb-5 md:text-[5rem] text-[2.5rem]">
            <span class="text-blue-500">Auth</span>Firebase
          </h3>
          <div class="flex flex-col items-center select-none" v-if="isEmail">
            <span class="mr-2 md:text-[1.5rem] text-xl text-gray-500">{{ subtitleText }}</span>
            <span
              class="text-blue-400 md:text-[1.5rem] text-xl cursor-pointer"
              @click="toggleAuth"
              >{{ linkAccountText }}</span
            >
          </div>
          <div class="flex flex-col items-center" v-if="!isEmail">
            <span class="md:text-[2rem] text-[1.5rem]">Приветствую!</span>
            <span class="my-5 text-[1.5rem]">Вход с помощью:</span>
          </div>
        </div>

        <form
          @submit.prevent=""
          class="flex flex-col items-center md:w-[25vw] lg:w-[30vw] px-10"
          v-if="isEmail"
        >
          <div class="flex flex-col mb-5 w-full">
            <label for="email1 ">Email</label>
            <input
              v-model="email"
              type="email"
              id="email1"
              class="border-1 border-gray-300 p-2 outline-none rounded-md mb-5"
            />
          </div>

          <div class="flex flex-col mb-5 w-full">
            <label for="password1 ">Пароль</label>
            <input
              v-model="password"
              type="password"
              id="password1"
              class="border-1 border-gray-300 p-2 outline-none rounded-md mb-5"
            />
          </div>

          <div
            @click="submitFormEmail"
            class="flex items-center justify-between bg-blue-500 text-white h-12 w-full py-1 px-3 rounded-full mb-5 cursor-pointer hover:bg-blue-600"
          >
            <span class="pi pi-user"></span>

            <button>{{ submitButtonText }}</button>
            <span></span>
          </div>

          <div
            @click="goBack"
            class="flex items-center justify-between bg-gray-500 text-white h-12 w-full py-1 px-3 rounded-full mb-5 cursor-pointer hover:bg-gray-600"
          >
            <span class="pi pi-arrow-left"></span>
            <span>Назад</span>
            <span></span>
          </div>
        </form>
        <div v-if="!isEmail" class="md:w-[25vw] w-[60vw]">
          <div
            @click="goEmail"
            class="flex items-center justify-between bg-blue-500 text-white h-12 py-1 px-3 rounded-md mb-5 cursor-pointer hover:bg-blue-600"
          >
            <span class="pi pi-user"></span>
            <span>Почта | Пароль</span>
            <span></span>
          </div>
          <div
            @click="submitFormGoogle"
            class="flex items-center justify-between bg-orange-600 text-white h-12 py-1 px-3 rounded-md mb-5 cursor-pointer hover:bg-orange-700"
          >
            <span class="pi pi-google"></span>
            <span>Google</span>
            <span></span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
