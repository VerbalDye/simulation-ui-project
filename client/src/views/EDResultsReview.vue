<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <ExperimentDesignerSidebar currentPage="5" />
        <div class="content">
            <h1>6. Results Review</h1>
            <!-- <PlotlyChart v-if="assetAvailabilityData" :data="assetAvailabilityData" id="1" title="Weekly Throughput" group="asset_name" x="process_time" xTitle="Processing Times (Minutes)" y="weekly_throughput" yTitle="Weekly Throughput" :hover="['week']"/> -->
            <!-- <PlotlyChart v-if="resourceUtilizationData" :data="resourceUtilizationData[0]" id="2" title="Asset Utilization" group="display_name" x="process_time" xTitle="Processing Times (Minutes)" y="AVG(util.processing_time )" yTitle="Utilization" :hover="['iteration_number','replication','utilization']"/> -->
            <PlotlyChart v-if="throughputData" :data="throughputData[0]" id="3" title="Weekly Throughput" group="asset_name" x="process_time" xTitle="Processing Times (Minutes)" y="weekly_throughput" yTitle="Weekly Throughput" :hover="['week']"/>
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
import PlotlyChart from '@/components/PlotlyChart.vue';
import dataRequest from '@/utils/dataRequest';
export default {
    data() {
        return {
            experimentID: null,
            assetAvailabilityData: null,
            resourceUtilizationData: null,
            throughputData: null
        }
    },
    mixins: [titleMixin],
    title: 'Experiment Designer',
    components: { Sidebar, Header, ExperimentDesignerSidebar, ExperimentDesignerSidebar, SmartTable, PlotlyChart },
    methods: {
        getExperimentID() {
            this.experimentID = window.location.href.split("/")[window.location.href.split("/").length - 1];
        },
        async getAssetAvailability() {
            let data = await dataRequest("/api/experiment/asset-availability/" + this.experimentID, "GET");
            console.log(data);
            this.assetAvailabilityData = data;
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
            this.getAssetAvailability();
            this.getResourceUtilization();
            this.getThroughput();
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