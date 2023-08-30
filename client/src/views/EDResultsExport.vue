<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <ExperimentDesignerSidebar currentPage="6" />
        <div class="content">
            <h1>7. Results Save & Export</h1>
            <div class="flex-between">
                <h2>Save</h2>
                <i class="bi bi-plus-circle-fill"></i>
            </div>
            <div class="flex-between">
                <h2>Export</h2>
                <i class="bi bi-plus-circle-fill"></i>
            </div>
            <div class="flex-right"><button @click="clickBack">Back</button><router-link to="/experiments/design">Next</router-link></div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import titleMixin from '../mixins/titleMixin';
import Sidebar from '@/components/Sidebar.vue';
import ExperimentDesignerSidebar from '@/components/ExperimentDesignerSidebar.vue';
export default {
    data() {
        return {

        }
    },
    mixins: [titleMixin],
    title: 'Experiment Designer',
    components: { Sidebar, Header, ExperimentDesignerSidebar, ExperimentDesignerSidebar },
    methods: {
        clickBack() {
            this.$router.push("/experiments/design/results-review/" + window.location.href.split("/")[window.location.href.split("/").length - 1]);
        },
    }
}
</script>

<style>
.content h1 {
    text-align: left;
}
</style>