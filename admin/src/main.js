import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'vue-select/dist/vue-select.css';
import Notifications from '@kyvg/vue3-notification'
import { library } from '@fortawesome/fontawesome-svg-core'

import {
  faUser,
  faEnvelope,
  faLock,
  faTrash,
  faPen,
  faSpider,
  faChevronRight,
  faChevronLeft,
  faFileAlt,
  faTags,
  faTag,
  faBox,
  faCog,
  faLineChart,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import vSelect from 'vue-select'


library.add(
  faUser,
  faEnvelope,
  faLock,
  faTrash,
  faPen,
  faSpider,
  faChevronRight,
  faChevronLeft,
  faFileAlt,
  faTags,
  faTag,
  faBox,
  faCog,
  faLineChart,
  faPlus,
)
const app = createApp(App)
app.component('v-select', vSelect)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router).use(Notifications).mount('#app')
