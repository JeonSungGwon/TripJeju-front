import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

library.add(fas);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);
app.component('VueDatePicker', VueDatePicker);
app.use(router);

app.mount('#app');
