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
                <div class="flex-vertical flex-align-start extra-height">
                    <div v-if="cellOptions" class="card-with-title">
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
                    <button class="space"
                        @click="downloadData(resourceUtilizationData, experimentData.experiment_name + 'resource-util')">Download
                        Resource
                        Utilization</button>
                    <button class="space"
                        @click="downloadData(throughputData, experimentData.experiment_name + 'throughput')">Download
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
            selectedCells: [],
            cellOptions: [],
            running: null,
            loading: false,
            warning: false
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
        async getGoalData() {
            let data = await dataRequest("/api/experiment/goal/" + this.experimentID, "GET");
            // console.log(data);
            this.goalData = data;
        },
        async getProductionScheduleData(iteration_number, replication) {
            let data = await dataRequest("/api/experiment/production-schedule/processed/" + this.experimentID + "-" + iteration_number + "-" + replication, "GET");
            console.log(data);
            this.productionScheduleData = data;
            data.forEach(entry => {
                if (this.cellOptions.indexOf(entry.cell_name) == -1) {
                    // this.selectedJobs.push(entry.job_number);
                    this.cellOptions.push(entry.cell_name);
                }
            })
            console.log(this.cellOptions);
            // data.forEach(entry => {
            //     if (uniqueJobNumbers.indexOf(entry.job_number) == -1) {
            //         uniqueJobNumbers.push(entry.job_number);
            //         this.selectedJobs[entry.job_number] = true;
            //     }
            // })
            // this.displayTimelineData = this.jobTimelineData.filter(e => this.selectedCells.indexOf(e.job_number) !== -1);
        },
        async getData() {
            this.loading = true;
            await Promise.all([
                this.getCurrentlyRunning(),
                this.getResourceUtilization(),
                this.getThroughput(),
                this.getExperimentData(),
                this.getGoalData()
            ])
            if (this.experimentData.scenario.scenario_id == 8) {
                let compatibleRuns = [{ iteration_number: 1, replication: 0, count: 0 }]
                this.goalData.forEach(goal => {
                    let replications = this.resourceUtilizationData.filter(e => e.display_name == goal.asset.display_name && e.iteration_number !== 0);
                    replications.forEach(replication => {
                        if (goal.greater_than) {
                            if (replication.utilization > goal.utilization * 100) {
                                let entry = compatibleRuns.find(e => e.iteration_number == replication.iteration_number && e.replication == replication.replication);
                                if (entry) {
                                    entry.count = entry.count + 1;
                                } else {
                                    compatibleRuns.push({
                                        iteration_number: replication.iteration_number,
                                        replication: replication.replication,
                                        count: 1
                                    })
                                }
                            }
                        } else {
                            if (replication.utilization < goal.utilization * 100) {
                                let entry = compatibleRuns.find(e => e.iteration_number == replication.iteration_number && e.replication == replication.replication);
                                if (entry) {
                                    entry.count = entry.count + 1;
                                } else {
                                    compatibleRuns.push({
                                        iteration_number: replication.iteration_number,
                                        replication: replication.replication,
                                        count: 1
                                    })
                                }
                            }
                        }
                    })
                })
                let bestRun = compatibleRuns.reduce((acc, value) => {
                    if (value.count > acc.count) {
                        return value;
                    } else {
                        return acc;
                    }
                });
                this.replicationSelection = bestRun;
                await this.getProductionScheduleData(bestRun.iteration_number, bestRun.replication);
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
                window.aler("Please select a cell before attempting to download.");
            }
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

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style>
.content h1 {
    text-align: left;
}
.extra-height {
    height: 70vh;
}
</style>