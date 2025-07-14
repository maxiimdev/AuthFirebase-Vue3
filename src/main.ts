import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyB1oh9mRUQ4ALaZ-NPvlhSjTiyVkW6AHh8',
  authDomain: 'auth-29642.firebaseapp.com',
  projectId: 'auth-29642',
  storageBucket: 'auth-29642.firebasestorage.app',
  messagingSenderId: '457155171262',
  appId: '1:457155171262:web:0652211a37cf6a607b1fef',
  measurementId: 'G-ZCR2E7PYMC',
}

// Initialize Firebase
initializeApp(firebaseConfig)
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
