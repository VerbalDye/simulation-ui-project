<template>
    <WarningModal :display="warning">
        <div v-if="running">
            <p class="space">The experiment is currently running please reload the page to get latest status. Alternatively,
                you can click
                "Simulation Start" below to navigate to the "Simulation Run" page to get live experiment status. </p>
            <router-link :to="'/experiments/design/simulation-start/' + experimentID" class="link-button">Simulation
                Status</router-link>
        </div>
        <div v-else>
            <p class="space">Seems like there is no output data for this experiment and it is not currently running. Click
                one of the buttons below to either define inputs or start the simulation run.</p>
            <router-link :to="'/experiments/design/results-review/' + experimentID" class="link-button">Take Me To
                Input Definition</router-link>
            <router-link :to="'/experiments/design/simulation-start/' + experimentID" class="link-button">Take Me To
                Simulation Start</router-link>
        </div>
    </WarningModal>
    <LoadingModal :display="loading" :estimatedLoadingTime="3000" />
    <Header />
    <div class="site-container">
        <Sidebar />
        <ExperimentDesignerSidebar currentPage="6" />
        <div class="content">
            <h1>7. Results Save & Export</h1>
            <Collapsable title="Save" name="save" next="export">
                TBD
            </Collapsable>
            <Collapsable title="Export" name="export" back="save" :defaultOpen="true">
                <div class="flex-vertical flex-align-start">
                    <button class="space" @click="downloadData(resourceUtilizationData, 'resource-util')">Download
                        Resource
                        Utilization</button>
                    <button class="space" @click="downloadData(throughputData, 'throughput')">Download
                        Throughput</button>
                </div>
            </Collapsable>
            <div class="flex-right">
                <button @click="clickBack">Back</button>
                <router-link to="/experiments/design" class="link-button">Next</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import titleMixin from '../mixins/titleMixin';
import Sidebar from '@/components/Sidebar.vue';
import ExperimentDesignerSidebar from '@/components/ExperimentDesignerSidebar.vue';
import Collapsable from '@/components/Collapsable.vue';
import WarningModal from '@/components/WarningModal.vue';
import LoadingModal from '@/components/LoadingModal.vue';
import dataRequest from '@/utils/dataRequest';
import csvJson from '@/utils/csvJson';
export default {
    data() {
        return {
            experimentID: null,
            resourceUtilizationData: null,
            throughputData: null,
            running: null,
            loading: false,
            warning: false
        }
    },
    mixins: [titleMixin],
    title: 'Experiment Designer',
    components: { Sidebar, Header, ExperimentDesignerSidebar, ExperimentDesignerSidebar, Collapsable, WarningModal, LoadingModal },
    methods: {
        getExperimentID() {
            this.experimentID = window.location.href.split("/")[window.location.href.split("/").length - 1];
        },
        async getCurrentlyRunning() {
            let data = await dataRequest("/api/experiment/running/" + this.experimentID, "GET");
            this.running = data.running
        },
        async getResourceUtilization() {
            let data = await dataRequest("/api/experiment/resource-util/processed/" + this.experimentID, "GET");
            console.log(data);
            this.resourceUtilizationData = data;
        },
        async getThroughput() {
            let data = await dataRequest("/api/experiment/throughput/processed/" + this.experimentID, "GET");
            console.log(data);
            this.throughputData = data;
        },
        async getData() {
            this.loading = true;
            await Promise.all([
                this.getCurrentlyRunning(),
                this.getResourceUtilization(),
                this.getThroughput()
            ])
            this.loading = false;
            this.warning = (this.throughputData.length == 0 || this.resourceUtilizationData.length == 0);
        },
        downloadData(data, name) {
            csvJson.downloadJSONDataAsCSV(data, name)
        },
        clickBack() {
            this.$router.push("/experiments/design/results-review/" + this.experimentID);
        },
    },
    mounted() {
        this.getExperimentID();
        this.getData();
    }
}
</script>

<style>
.content h1 {
    text-align: left;
}</style>