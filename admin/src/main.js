import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Notifications from '@kyvg/vue3-notification';
import 'vue-toastification/dist/index.css';
createApp(App).use(router).use(Notifications).mount('#app');