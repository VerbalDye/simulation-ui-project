<template>
    <WarningModal :display="warning">
        <div v-if="running">
            <p class="space">The experiment is currently running please reload the page to get latest status. Alternatively, you can click
                "Simulation Start" below to navigate to the "Simulation Run" page to get live experiment status. </p>
                <router-link :to="'/experiments/design/simulation-start/' + this.experimentID" class="link-button">Simulation Status</router-link>
        </div>
        <div v-else>
            <p class="space">Seems like there is no output data for this experiment and it is not currently running. Click
                one of the buttons below to either define inputs or start the simulation run.</p>
            <router-link :to="'/experiments/design/experiment-configuration/' + this.experimentID" class="link-button">Take Me To
                Input Definition</router-link>
            <router-link :to="'/experiments/design/simulation-start/' + this.experimentID" class="link-button">Take Me To
                Simulation Start</router-link>
        </div>
    </WarningModal>
    <LoadingModal :display="loading" :estimatedLoadingTime="3000" />
    <Header />
    <div class="site-container">
        <Sidebar />
        <ExperimentDesignerSidebar currentPage="5" />
        <div class="content">
            <h1>6. Results Review</h1>
            <div>
                <!-- <PlotlyChart v-if="assetAvailabilityData" :data="assetAvailabilityData" id="1" title="Weekly Throughput" group="asset_name" x="process_time" xTitle="Processing Times (Minutes)" y="weekly_throughput" yTitle="Weekly Throughput" :hover="['week']"/> -->
                <PlotlyChart v-if="resourceUtilizationData" :data="resourceUtilizationData" id="2"
                    title="Asset Utilization" group="display_name" x="AVG(util.processing_time )"
                    xTitle="Average Processing Time (Minutes)" y="utilization" yTitle="Utilization (%)"
                    :hover="['iteration_number', 'replication', 'utilization']"
                    :hoverTitles="['Iteration Number', 'Replication Number', 'Utilization']" />
                <PlotlyChart v-if="throughputData" :data="throughputData" id="3" title="Weekly Throughput"
                    group="asset_name" x="process_time" xTitle="Processing Times (Minutes)" y="weekly_throughput"
                    yTitle="Weekly Throughput" :hover="['iteration_number', 'replication', 'week']" :hoverTitles="['Iteration Number', 'Replication Number', 'Week Number']" />
            </div>
            <div class="flex-right">
                <button @click="clickBack">Back</button>
                <button @click="clickNext">Next</button>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import titleMixin from '../mixins/titleMixin';
import Sidebar from '@/components/Sidebar.vue';
import ExperimentDesignerSidebar from '@/components/ExperimentDesignerSidebar.vue';
import SmartTable from '@/components/SmartTable.vue';
import PlotlyChart from '@/components/PlotlyChart.vue';
import LoadingModal from '@/components/LoadingModal.vue';
import WarningModal from '@/components/WarningModal.vue';
import dataRequest from '@/utils/dataRequest';
export default {
    data() {
        return {
            experimentID: null,
            resourceUtilizationData: null,
            throughputData: null,
            running: null,
            loading: true,
            warning: false
        }
    },
    mixins: [titleMixin],
    title: 'Experiment Designer',
    components: { Sidebar, Header, ExperimentDesignerSidebar, ExperimentDesignerSidebar, SmartTable, PlotlyChart, LoadingModal, WarningModal },
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
            this.resourceUtilizationData = data[0].map(({ utilization, ...rest }) => {
                let obj = rest;
                obj.utilization = Math.round((utilization * 10000))/100;
                return obj;
            });
            console.log(this.resourceUtilizationData);
        },
        async getThroughput() {
            let data = await dataRequest("/api/experiment/throughput/processed/" + this.experimentID, "GET");
            console.log(data);
            this.throughputData = data[0];
        },
        async getData() {
            await Promise.allSettled([
                this.getResourceUtilization(),
                this.getThroughput(),
                this.getCurrentlyRunning()
            ])
            this.loading = false;
            this.warning = (this.throughputData.length == 0 || this.resourceUtilizationData.length == 0);
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
        this.getData();
    }
}
</script>

<style>.content h1 {
    text-align: left;
}</style>