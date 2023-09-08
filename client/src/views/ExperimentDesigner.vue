<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <div class="content">
            <h1>Experiment Designer</h1>
            <p>Welcome the the Experiment Designer Tool! This tools is designed to allow you to have full control over the
                simulation you want to run. Using industry leading web service technology you are able to configure, start,
                view progress of, and read results of a custom simulation run directly from your browser.</p>
            <div class="flex-right"><router-link to="/experiments/design/scenario" class="link-button">Next</router-link></div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import titleMixin from '../mixins/titleMixin';
import Sidebar from '@/components/Sidebar.vue';
export default {
    mixins: [titleMixin],
    title: 'Experiment Designer',
    components: { Sidebar, Header }
}
</script>

<style>

</style>
