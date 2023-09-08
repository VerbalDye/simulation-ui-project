<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <ExperimentDesignerSidebar currentPage="5" />
        <div class="content">
            <h1>6. Results Review</h1>
            <!-- <SmartTable v-if="resourceUtilizationData" :jsonData="resourceUtilizationData" /> -->
            <div class="flex-right"><button @click="clickBack">Back</button><button @click="clickNext">Next</button></div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import titleMixin from '../mixins/titleMixin';
import Sidebar from '@/components/Sidebar.vue';
import ExperimentDesignerSidebar from '@/components/ExperimentDesignerSidebar.vue';
import SmartTable from '@/components/SmartTable.vue';
import dataRequest from '@/utils/dataRequest';
export default {
    data() {
        return {
            experimentID: null,
            resourceUtilizationData: null
        }
    },
    mixins: [titleMixin],
    title: 'Experiment Designer',
    components: { Sidebar, Header, ExperimentDesignerSidebar, ExperimentDesignerSidebar, SmartTable },
    methods: {
        getExperimentID() {
            this.experimentID = window.location.href.split("/")[window.location.href.split("/").length - 1];
        },
        async getResourceUtilization() {
            let data = await dataRequest("/api/experiment/resource-util/" + this.experimentID, "GET")
            console.log(data);
            this.resourceUtilizationData = data;
        },
        clickBack() {
            this.$router.push("/experiments/design/simulation-start/" + this.experimentID);
        },
        clickNext() {
            this.$router.push("/experiments/design/results-export/" + this.experimentID);
        }
    },
    mounted() {
        this.getExperimentID();
        this.getResourceUtilization();
    }
}
</script>

<style>
.content h1 {
    text-align: left;
}
</style>