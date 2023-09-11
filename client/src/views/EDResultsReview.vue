<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <ExperimentDesignerSidebar currentPage="5" />
        <div class="content">
            <h1>6. Results Review</h1>
            <div v-if="status == 'loaded-data'">
                <!-- <PlotlyChart v-if="assetAvailabilityData" :data="assetAvailabilityData" id="1" title="Weekly Throughput" group="asset_name" x="process_time" xTitle="Processing Times (Minutes)" y="weekly_throughput" yTitle="Weekly Throughput" :hover="['week']"/> -->
                <PlotlyChart v-if="resourceUtilizationData" :data="resourceUtilizationData[0]" id="2" title="Asset Utilization" group="display_name" x="AVG(util.processing_time )" xTitle="Processing Times (Minutes)" y="utilization" yTitle="Utilization" :hover="['iteration_number','replication','utilization']" :hoverTitles="['Iteration Number', 'Replication Number', 'Utilization']" />
                <PlotlyChart v-if="throughputData" :data="throughputData[0]" id="3" title="Weekly Throughput"
                    group="asset_name" x="process_time" xTitle="Processing Times (Minutes)" y="weekly_throughput"
                    yTitle="Weekly Throughput" :hover="['week']" :hoverTitles="['Week Number']"/>
                <!-- <SmartTable v-if="resourceUtilizationData" :jsonData="resourceUtilizationData" /> -->
            </div>
            <div v-else-if="status == 'loaded-no-data'">
                <div v-if="running">
                    <p>The experiment is currently running please reload the page to get latest status. Alternatively, you can click "Back" below to navigate to the "Simulation Run" page to get live experiment status. </p>
                </div>
                <div v-else>
                    <p class="space">Seems like there is no output data for this experiment and it is not currently running. Click one of the buttons below to either define inputs or start the simulation run.</p>
                    <router-link :to="'/experiments/design/results-review/' + this.experimentID" class="link-button">Take Me To Input Definition</router-link>
                    <router-link :to="'/experiments/design/simulation-start/' + this.experimentID" class="link-button">Take Me To Simulation Start</router-link>
                </div>
            </div>
            <div v-else>
                <h2>Loading...</h2>
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
import dataRequest from '@/utils/dataRequest';
export default {
    data() {
        return {
            experimentID: null,
            resourceUtilizationData: null,
            throughputData: null,
            status: 'loading',
            running: null,
        }
    },
    mixins: [titleMixin],
    title: 'Experiment Designer',
    components: { Sidebar, Header, ExperimentDesignerSidebar, ExperimentDesignerSidebar, SmartTable, PlotlyChart },
    methods: {
        getExperimentID() {
            this.experimentID = window.location.href.split("/")[window.location.href.split("/").length - 1];
        },
        async getRunning() {
            let data = await dataRequest("/api/experiment/running/" + this.experimentID, "GET");
            console.log(data);
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
            await Promise.allSettled([
                this.getResourceUtilization(),
                this.getThroughput(),
                this.getRunning()
            ])
            if (this.throughputData[0].length == 0) {
                this.status = 'loaded-no-data';
            } else {
                this.status = 'loaded-data';
            }
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

<style>
.content h1 {
    text-align: left;
}
</style>