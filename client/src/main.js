import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import LoadScript from 'vue-plugin-load-script';

let app = createApp(App).use(router).mount('#app');
app.use(LoadScript);

