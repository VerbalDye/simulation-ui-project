<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <div class="content">
            <div class="space">
                <h1>User Account</h1>
                <h3>First Name: {{ this.userAccount.first_name }}</h3>
                <h3>Last Name: {{ this.userAccount.last_name }}</h3>
                <h3>Email: {{ this.userAccount.email }}</h3>
            </div>
            <button @click="handleDelete">Delete Account</button>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import titleMixin from '../mixins/titleMixin';
import Sidebar from '@/components/Sidebar.vue';
import auth from '@/utils/auth';
import dataRequest from '@/utils/dataRequest';
export default {
    data() {
        return {
            userAccount: {}
        }
    },
    mixins: [titleMixin],
    title: 'Account',
    components: { Sidebar, Header },
    methods: {
        async getUserAccount() {
            let user = await auth.getProfile();
            let data = await dataRequest("/api/user/" + user.user_id, "GET");
            this.userAccount = { ...data };
        },
        async handleDelete() {
            let data = await dataRequest("/api/user/" + auth.getProfile().user_id, "DELETE");
            auth.logout();
        }
    },
    mounted() {
        this.getUserAccount();
    }
}
</script>
