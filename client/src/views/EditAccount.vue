<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <div class="content">
            <h1>Edit Account Details</h1>
            <div class="flex-between">
                <div class="card-with-title" v-if="userAccountData">
                    <div class="card-title">Update Account</div>
                    <form id="update-form" @submit="handleUpdateAccount">
                        <table class="grid-less">
                            <tr>
                                <th><label for="first-name-input">First Name: </label></th>
                                <td><input type="text" id="first-name-input" name="first-name-input"
                                        :value="userAccountData.first_name"></td>
                            </tr>
                            <tr>
                                <th><label for="last-name-input">Last Name: </label></th>
                                <td><input type="text" id="last-name-input" name="last-name-input"
                                        :value="userAccountData.last_name"></td>
                            </tr>
                            <tr>
                                <th><label for="email-input">Email: </label></th>
                                <td><input type="email" id="email-input" name="email-input" :value="userAccountData.email">
                                </td>
                            </tr>
                            <tr>
                                <th>Admin?</th>
                                <td><label class="switch">
                                        <input type="checkbox" name="process-time-default-input" :checked="userAccountData.role == 'admin' ? true : false">
                                        <span class="slider round"></span>
                                    </label>
                                </td>
                            </tr>
                        </table>
                        <button>Update Account</button>
                    </form>
                </div>
                <div>
                    <div class="card-with-title">
                        <div class="card-title">Update User Password</div>
                        <form id="password-form" @submit="handleUpdatePassword" class="space">
                            <table>
                                <tr>
                                    <th><label for="password-input">Password: </label></th>
                                    <td><input type="password" id="password-input" name="password-input"></td>
                                </tr>
                            </table>
                            <button class="space">Update Password</button>
                        </form>
                    </div>
                </div>
                <div class="card-with-title">
                    <div class="card-title">Delete User</div>
                    <button @click="handleDeleteAccount">Delete Account</button>
                </div>
            </div>
            <div class="flex-right">
                <router-link to="/admin/account-management" class="link-button space">Back to Account Management</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import titleMixin from '../mixins/titleMixin';
import dataRequest from '@/utils/dataRequest';
export default {
    data() {
        return {
            userID: null,
            userAccountData: null
        }
    },
    components: { Header, Sidebar },
    mixins: [titleMixin],
    title: 'Edit Account',
    methods: {
        getUserID() {
            this.userID = window.location.href.split("/")[window.location.href.split("/").length - 1];
        },
        async getUserInfo() {
            let data = await dataRequest("/api/user/" + this.userID, "GET");
            console.log(data);
            this.userAccountData = data;
        },
        async handleUpdateAccount(e) {
            e.preventDefault();
            const body = { first_name: e.target[0].value, last_name: e.target[1].value, email: e.target[2].value, role: e.target[3].checked ? 'admin' : 'user' };
            let data = await dataRequest("/api/user/" + this.userID, "PUT", JSON.stringify(body), { statusOnly: true });
            if (data.status == 200) {
                window.alert("Account Updated!");
            } else {
                window.alert("Account not updated. Check all value are valid and email is unique.")
            }
        },
        async handleUpdatePassword(e) {
            e.preventDefault();
            const body = { password: e.target[0].value };
            let data = await dataRequest("/api/user/" + this.userID, "PUT", JSON.stringify(body), { statusOnly: true });
            if (data.status == 200) {
                window.alert("Password Updated!");
            } else {
                window.alert("Password not updated. Password must be 8 characters long.")
            }
        },
        async handleDeleteAccount(e) {
            e.preventDefault();
            let data = await dataRequest("/api/user/" + this.userID, "DELETE", null, { statusOnly: true });
            if (data.status == 200) {
                window.alert("Account Deleted!");
                this.$router.push('/admin/account-management');
            } else {
                window.alert("Account not deleted. Check connection.")
            }
        }
    },
    mounted() {
        this.locationSearch = window.location.search;
        this.getUserID();
        this.getUserInfo();
    }
}
</script>