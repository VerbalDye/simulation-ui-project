<template>
    <div class="site-container">
        <h1>Login</h1>
        <form id="login-form" @submit="handleLogin">
            <div>
                <label for="email-input">Email: </label>
                <input type="email" id="email-input" name="email-input">
            </div>
            <div>
                <label for="password-input">Password: </label>
                <input type="password" id="password-input" name="password-input">
            </div>
            <button>Login</button>
        </form>
        <br />
        <router-link :to="'/signup' + this.locationSearch">Create Account</router-link>
    </div>
</template>

<script>
import titleMixin from '../mixins/titleMixin';
import auth from '../utils/auth';
import dataRequest from '@/utils/dataRequest';
export default {
    data() {
        return {
            locationSearch: ""
        }
    },
    mixins: [titleMixin],
    title: 'Login',
    methods: {
        async handleLogin(e) {
            e.preventDefault();
            const body = { email: e.target[0].value, password: e.target[1].value }
            await dataRequest("/api/user/login", "POST", JSON.stringify(body))
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
