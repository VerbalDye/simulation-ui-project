<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <div class="content">
            <h1>AnyLogic Simulation UI Project</h1>
            <router-link to="/account">Account Information</router-link><br/>
            <router-link to="/create-account" v-if="admin">Create Account</router-link>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import titleMixin from '../mixins/titleMixin';
import Sidebar from '@/components/Sidebar.vue';
import auth from '@/utils/auth';
export default {
    data() {
        return {
            admin: auth.isAdmin()
        }
    },
    mixins: [titleMixin],
    title: 'Dashboards',
    components: { Sidebar, Header }
}
</script>
