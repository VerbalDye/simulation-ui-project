import Vue from 'vue'
import App from './App.vue'
import router from './router'
import LoadScript from 'vue-plugin-load-script';

Vue.use(LoadScript);
Vue.createApp(App).use(router).mount('#app')
