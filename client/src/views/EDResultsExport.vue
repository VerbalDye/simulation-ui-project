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
            <Collapsable title="Save" name="save" next="export" :reset="collapsableStatus['save']" @toggle-collapse="collapsableToggleChange" :tbd="true">
                TBD
            </Collapsable>
            <Collapsable title="Export" name="export" back="save" :defaultOpen="true" :reset="collapsableStatus['export']" @toggle-collapse="collapsableToggleChange">
                <div class="flex-vertical flex-align-start extra-height">
                    <div v-if="cellOptions.length" class="card-with-title">
                        <div class="card-title">Cell Production Schedule</div>
                        <p>Select Cells to Export into Excel Schedules.</p>
                        <VueMultiselect v-model="selectedCells" :options="cellOptions" :multiple="true"
                            :close-on-select="false" placeholder="Select at least one cell"
                            @update:model-value="handleCellSelectChange" :preselect-first="true" class="multi-select">
                            <template slot="selection" slot-scope="{ values, search, isOpen }"><span
                                    class="multiselect__single" v-if="values.length" v-show="!isOpen">{{ values.length }}
                                    options selected</span></template>
                        </VueMultiselect>
                        <button class="space"
                            @click="downloadCellScheduleData">Download
                            Selected Cell Job Data</button>
                    </div>
                    <button class="space" v-if="cellOptions.length"
                            @click="downloadData(productionScheduleData, experimentData.experiment_name + '-production-schedule-all')">Download
                            All Cell Job Data</button>
                    <button class="space"
                        @click="downloadData(resourceUtilizationData, experimentData.experiment_name + '-resource-util')">Download
                        Resource
                        Utilization</button>
                    <button class="space"
                        @click="downloadData(throughputData, experimentData.experiment_name + '-throughput')">Download
                        Throughput</button>
                </div>
            </Collapsable>
            <div class="flex-right space">
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
import VueMultiselect from 'vue-multiselect';
import dataRequest from '@/utils/dataRequest';
import csvJson from '@/utils/csvJson';
export default {
    data() {
        return {
            experimentID: null,
            resourceUtilizationData: null,
            throughputData: null,
            productionScheduleData: null,
            experimentData: null,
            goalData: null,
            assetData: null,
            selectedCells: [],
            cellOptions: [],
            running: null,
            loading: false,
            warning: false,
            collapsableStatus: {}
        }
    },
    mixins: [titleMixin],
    title: 'Experiment Designer',
    components: { Sidebar, Header, ExperimentDesignerSidebar, ExperimentDesignerSidebar, Collapsable, WarningModal, LoadingModal, VueMultiselect },
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
            // console.log(data);
            this.resourceUtilizationData = data;
        },
        async getThroughput() {
            let data = await dataRequest("/api/experiment/throughput/processed/" + this.experimentID, "GET");
            // console.log(data);
            this.throughputData = data;
        },
        async getExperimentData() {
            let data = await dataRequest("/api/experiment/" + this.experimentID, "GET");
            // console.log(data);
            this.experimentData = data;
        },
        async getAssetData() {
            let data = await dataRequest("/api/experiment/asset/" + this.experimentID, "GET");
            // console.log(data);
            this.assetData = data;
        },
        async getGoalData() {
            let data = await dataRequest("/api/experiment/goal/" + this.experimentID, "GET");
            // console.log(data);
            this.goalData = data;
        },
        async getProductionScheduleData(iteration_number, replication) {
            let data = await dataRequest("/api/experiment/production-schedule/processed/" + this.experimentID + "-" + iteration_number + "-" + replication, "GET");
            console.log(data);
            this.productionScheduleData = data.map(({ task_start, task_end, ...rest }) => {
                rest.task_start_date = task_start.split("T")[0]
                rest.task_start_time = task_start.split("T")[1].replace("Z", "");
                rest.task_end_date = task_end.split("T")[0]
                rest.task_end_time = task_end.split("T")[1].replace("Z", "");
                return rest
            });
            data.forEach(entry => {
                if (this.cellOptions.indexOf(entry.cell_name) == -1) {
                    // this.selectedJobs.push(entry.job_number);
                    this.cellOptions.push(entry.cell_name);
                }
            })
            console.log(this.cellOptions);
            console.log(this.productionScheduleData);
        },
        testReplication(data, test) {
            let method = test.method;
            switch (method) {
                case 'highest':
                    return data.reduce((acc, value) => value > acc ? value : acc);
                case 'lowest':
                    return data.reduce((acc, value) => value < acc ? value : acc);
                case 'median':
                    return data[Math.floor(data.sort((a, b) => a.priority - b.priority).length / 2)];
                case 'greater_than':
                    return data.filter(e => e > test.value);
                case 'less_than':
                    return data.filter(e => e > test.value);
            }
        },
        getReplicationsForPriority(replications, lastPriority) {
            let successes = []
            this.goalData.sort((a, b) => a.priority - b.priority);
            let goals = this.goalData.filter(e => e.priority > lastPriority).filter((e, index, arr) => e.priority == arr[0].priority);
            goals.forEach(goal => {
                replications.forEach(replication => {
                    if ((goal.type == "throughput" && this.testReplication(replication.throughputData.map(e => e.throughput), goal)) || (goal.type == "utilization" && this.testReplication(replication.utilizationData.map(e => e.utilization), goal))) {
                        let entry = successes.find(e => e.iteration_number == replication.iteration_number && e.replication == replication.replication);
                        if (entry) {
                            entry.count = entry.count + 1;
                        } else {
                            successes.push({
                                iteration_number: replication.iteration_number,
                                replication: replication.replication,
                                count: 1
                            })
                        }
                    }
                })
            })
            let newReplications;
            if (successes.length) {
                let maxCount = successes.reduce((acc, value) => value < acc ? value : acc).count;
                newReplications = replications.filter((e, index) => successes.find(f => f.iteration_number == e.iteration_number && f.replication == e.replication).count == maxCount);
            } else {
                newReplications = [replications[0]];
            }
            if (this.goalData.find(e => e.priority > goals[0].priority)) {
                return this.getReplicationsForPriority(newReplications, goals[0].priority)
            } else {
                return  newReplications.map(({ utilizationData, throughputData, ...rest }) => rest);
            }
        },
        async getCanonReplication() {
            let replications = this.throughputData.filter(e => e.iteration_number !== 0).map(({ experiment_id, weekly_throughput, ...rest }) => rest);
            console.log(replications);
            replications.forEach(replication => {
                replication.utilizationData = this.resourceUtilizationData.filter(e => e.iteration_number == replication.iteration_number && e.replication == replication.replication);
                replication.throughputData = this.throughputData.filter(e => e.iteration_number == replication.iteration_number && e.replication == replication.replication);
            })
            this.replicationSelection = this.getReplicationsForPriority(replications, 0)[0];
            await this.getProductionScheduleData(this.replicationSelection.iteration_number, this.replicationSelection.replication);
        },
        async getData() {
            this.loading = true;
            await Promise.all([
                this.getCurrentlyRunning(),
                this.getResourceUtilization(),
                this.getThroughput(),
                this.getExperimentData(),
                this.getAssetData(),
                this.getGoalData()
            ])
            if (this.experimentData.scenario.scenario_id == 8) {
                await this.getCanonReplication();
            }
            this.loading = false;
            this.warning = (this.throughputData.length == 0 || this.resourceUtilizationData.length == 0);
        },
        downloadData(data, name) {
            csvJson.downloadJSONDataAsCSV(data, name)
        },
        downloadCellScheduleData() {
            if (this.selectedCells.length) {
            this.selectedCells.forEach(cell => {
                this.downloadData(this.productionScheduleData.filter(e => e.cell_name == cell), cell + "-" + this.experimentData.experiment_name);
            })
            } else {
                window.alert("Please select a cell before attempting to download.");
            }
        },
        clickBack() {
            this.$router.push("/experiments/design/results-review/" + this.experimentID);
        },
        createCollapsableObject() {
            const collapsableEls = document.querySelectorAll(".collapse-component");
            collapsableEls.forEach(element => {
                let name = element.id.split('collapsable-component-')[1]
                this.collapsableStatus[name] = { open: false, toggle: true }
            })
        },
        collapsableToggleChange({ name, open }) {
            this.collapsableStatus[name] = { open: open, toggle: !this.collapsableStatus[name].toggle };
        },
    },
    mounted() {
        this.createCollapsableObject();
        this.getExperimentID();
        this.getData();
    }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style>
.content h1 {
    text-align: left;
}
.extra-height {
    height: 70vh;
}
</style>