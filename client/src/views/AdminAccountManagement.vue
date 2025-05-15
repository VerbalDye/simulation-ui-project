<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <AdminSidebar />
        <div class="content">
            <h1>Admin Account Management</h1>
            <div class="flex-between">
                <div class="card-with-title">
                    <div class="card-title">Create Account</div>
                    <form id="login-form" @submit="handleCreateAccount">
                        <table class="grid-less">
                            <tr>
                                <th><label for="first-name-input">First Name: </label></th>
                                <td><input type="text" id="first-name-input" name="first-name-input"></td>
                            </tr>
                            <tr>
                                <th><label for="last-name-input">Last Name: </label></th>
                                <td><input type="text" id="last-name-input" name="last-name-input"></td>
                            </tr>
                            <tr>
                                <th><label for="email-input">Email: </label></th>
                                <td><input type="email" id="email-input" name="email-input"></td>
                            </tr>
                            <tr>
                                <th><label for="password-input">Password: </label></th>
                                <td><input type="password" id="password-input" name="password-input"></td>
                            </tr>
                            <tr>
                                <th>Admin?</th>
                                <td><label class="switch">
                                        <input type="checkbox" name="process-time-default-input">
                                        <span class="slider round"></span>
                                    </label>
                                </td>
                            </tr>
                        </table>
                        <button>Create Account</button>
                    </form>
                </div>
                <div v-if="userAccountData" class="card-with-title">
                    <div class="card-title">Current Users</div>
                    <SmartTable :jsonData="userAccountData" :links="links" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import SmartTable from '@/components/SmartTable.vue';
import AdminSidebar from '@/components/AdminSidebar.vue';
import titleMixin from '../mixins/titleMixin';
import dataRequest from '@/utils/dataRequest';
export default {
    data() {
        return {
            userAccountData: null,
            links: null
        }
    },
    components: { AdminSidebar, Header, Sidebar, SmartTable },
    mixins: [titleMixin],
    title: 'Account Management',
    methods: {
        async getUserAccounts() {
            let data = await dataRequest("/api/user", "GET");
            console.log(data);
            this.links = data.map(e => '/admin/account-edit/' + e.user_id);
            console.log(this.links);
            this.userAccountData = data;
        },
        async handleCreateAccount(e) {
            e.preventDefault();
            const body = { first_name: e.target[0].value, last_name: e.target[1].value, email: e.target[2].value, password: e.target[3].value, role: e.target[4].checked ? 'admin' : 'user' };
            let data = await dataRequest("/api/user", "POST", JSON.stringify(body), { statusOnly: true });
            if (data.status == 200) {
                this.getUserAccounts();
                window.alert("Account Created!");
            } else {
                window.alert("Account not created. Check all value are valid and email is unique.")
            }
        }
    },
    mounted() {
        this.locationSearch = window.location.search;
        this.getUserAccounts();
    }
}
</script>
