<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <ExperimentDesignerSidebar currentPage="5" />
        <div class="content">
            <h1>6. Results Review</h1>
            <div class="flex-right"><button @click="clickBack">Back</button><button @click="clickNext">Next</button></div>
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
            this.$router.push("/experiments/design/simulation-start/" + window.location.href.split("/")[window.location.href.split("/").length - 1]);
        },
        clickNext() {
            this.$router.push("/experiments/design/results-export/" + window.location.href.split("/")[window.location.href.split("/").length - 1]);
        }
    }
}
</script>

<style>
.content h1 {
    text-align: left;
}
</style>