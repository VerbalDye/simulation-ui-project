<template>
    <div class="site-container">
        <Sidebar />
        <div class="content">
            <Header />
            <h1>AnyLogic Simulation UI Project</h1>
            <router-link to="/account">Account Information</router-link>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import titleMixin from '../mixins/titleMixin';
import Sidebar from '@/components/Sidebar.vue';
export default {
    mixins: [titleMixin],
    title: 'Dashboards',
    components: { Sidebar, Header }
}
</script>
