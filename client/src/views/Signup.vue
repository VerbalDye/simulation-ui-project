<template>
    <div class="site-container">
        <h1>Create Account</h1>
        <form id="login-form" @submit="handleSignup">
            <div>
                <label for="first-name-input">First Name: </label>
                <input type="text" id="first-name-input" name="first-name-input">
            </div>
            <div>
                <label for="last-name-input">Last Name: </label>
                <input type="text" id="last-name-input" name="last-name-input">
            </div>
            <div>
                <label for="email-input">Email: </label>
                <input type="email" id="email-input" name="email-input">
            </div>
            <div>
                <label for="password-input">Password: </label>
                <input type="password" id="password-input" name="password-input">
            </div>
            <button>Create Account</button>
        </form>
        <br />
        <router-link :to="'/login' + locationSearch">Login</router-link>
    </div>
</template>

<script>
import titleMixin from '../mixins/titleMixin';
import dataRequest from '@/utils/dataRequest';
export default {
    data() {
        return {
            locationSearch: ""
        }
    },
    mixins: [titleMixin],
    title: 'Sign Up',
    methods: {
        async handleSignup(e) {
            e.preventDefault();
            const body = { first_name: e.target[0].value, last_name: e.target[1].value, email: e.target[2].value, password: e.target[3].value }
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
