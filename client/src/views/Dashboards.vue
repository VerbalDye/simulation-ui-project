<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <div class="content">
            <h1>AnyLogic Simulation UI Project</h1>
            <router-link to="/account" class="link-button space">Account Information</router-link><br/>
            <router-link to="/admin/account-management" v-if="admin" class="link-button space">Admin Settings</router-link><br/>
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
            admin: false
        }
    },
    mixins: [titleMixin],
    title: 'Dashboards',
    components: { Sidebar, Header },
    async mounted() {
        this.admin = await auth.isAdmin();
    }
}
</script>
