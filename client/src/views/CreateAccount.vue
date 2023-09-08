<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <div class="content">
            <h1>Create Account</h1>
            <div class="card">
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
            locationSearch: ""
        }
    },
    components: { Header, Sidebar },
    mixins: [titleMixin],
    title: 'Sign Up',
    methods: {
        async handleCreateAccount(e) {
            e.preventDefault();
            const body = { first_name: e.target[0].value, last_name: e.target[1].value, email: e.target[2].value, password: e.target[3].value, role: e.target[4].checked ? 'admin' : 'user' }
            console.log(body);
            await dataRequest("/api/user", "POST", JSON.stringify(body));
            const urlParameters = new URLSearchParams(window.location.search);
            for (const [key, value] of urlParameters) {
                if (key == 'redirect') {
                    this.$router.push(decodeURIComponent(value.toString()));
                    return
                }
            }
            this.$router.push('/');
        }
    },
    mounted() {
        this.locationSearch = window.location.search;
    }
}
</script>
