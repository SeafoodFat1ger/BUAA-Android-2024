import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import axios from "axios";
import { createPinia } from "pinia";


const app = createApp(App)
//配置服务器地址（后端）前缀
axios.defaults.baseURL = 'http://154.8.175.69'


import '@fortawesome/fontawesome-free/css/all.css';
app.use(router)
app.use(createPinia())
app.mount('#app')

