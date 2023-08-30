<template>
    <div class="site-container">
        <div class="content">
            <h1>Welcome! Please Login or Sign Up.</h1>
            <div class="flex">
                <img src="../assets/pv-logo-w-name-blue-rgb-150dpi.png" class="welcome-image" >
            </div>
            <div class="flex">
                <router-link :to="'/login' + this.queryString">Login</router-link>
                <router-link :to="'/signup' + this.queryString">Create Account</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import titleMixin from '../mixins/titleMixin';
export default {
    data() {
        return {
            queryString: window.location.search
        }
    },
    mixins: [titleMixin],
    title: 'Welcome'
}
</script>

<style>
.welcome-image {
    max-height: 50vh;
    max-width: 60vw;
    margin: 50px;
}
.flex {
    display: flex;
    justify-content: space-around;
}
.flex a {
    text-decoration: none;
    color: var(--black);
    font-size: 36px;
}
</style>