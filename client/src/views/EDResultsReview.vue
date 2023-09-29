<template>
    <!-- <component is="link" rel="stylesheet" href="../node_modules/vue-multiselect/dist/vue-multiselect.min.css"></component> -->
    <WarningModal :display="warning">
        <div v-if="running">
            <p class="space">The experiment is currently running please reload the page to get latest status. Alternatively,
                you can click
                "Simulation Status" below to navigate to the "Simulation Run" page to get live experiment status. </p>
            <router-link :to="'/experiments/design/simulation-start/' + this.experimentID" class="link-button">Simulation
                Status</router-link>
        </div>
        <div v-else>
            <p class="space">Seems like there is no output data for this experiment and it is not currently running. Click
                one of the buttons below to either define inputs or start the simulation run.</p>
            <router-link :to="'/experiments/design/experiment-configuration/' + this.experimentID" class="link-button">Take
                Me To
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
                <div v-if="displayTimelineData" class="card-with-title">
                    <div class="card-title">Job Timeline</div>
                    <VueMultiselect v-model="this.selectedJobs" :options="this.jobOptions" :multiple="true" :close-on-select="false" placeholder="Select at least one job" @update:model-value="handleJobSelectChange" :preselect-first="true">
                        <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single" v-if="values.length" v-show="!isOpen">{{ values.length }} options selected</span></template>
                    </VueMultiselect>
                    <TimelineChart :data="displayTimelineData" />
                    <p>Best Match for Target(s) Iteration: {{ replicationSelection.iteration_number }} Replication: {{
                        replicationSelection.replication }}</p>
                </div>
                <PlotlyChart v-if="resourceUtilizationData" :data="resourceUtilizationData" id="2" title="Asset Utilization"
                    group="display_name" x="AVG(util.processing_time )" xTitle="Average Processing Time (Minutes)"
                    y="utilization" yTitle="Utilization (%)" :hover="['iteration_number', 'replication', 'utilization']"
                    :hoverTitles="['Iteration Number ', 'Replication Number ', 'Utilization ']" type="scatter" />
                <PlotlyChart v-if="throughputData" :data="throughputData" id="3" title="Weekly Throughput"
                    group="replication" x="iteration_number" xTitle="Iteration" y="weekly_throughput"
                    yTitle="Weekly Throughput" :hover="['replication']" :hoverTitles="['']" type="bar" />
            </div>
            <div class="flex-right space">
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
import TimelineChart from '@/components/TimelineChart.vue';
import VueMultiselect from 'vue-multiselect';
import dataRequest from '@/utils/dataRequest';
import dayjs from 'dayjs';
export default {
    data() {
        return {
            experimentID: null,
            resourceUtilizationData: null,
            throughputData: null,
            jobTimelineData: null,
            experimentData: null,
            goalData: null,
            displayTimelineData: null,
            selectedJobs: [],
            jobOptions: [],
            running: null,
            loading: false,
            warning: false,
            replicationSelection: null
        }
    },
    mixins: [titleMixin],
    title: 'Experiment Designer',
    components: { Sidebar, Header, ExperimentDesignerSidebar, ExperimentDesignerSidebar, SmartTable, PlotlyChart, LoadingModal, WarningModal, TimelineChart, VueMultiselect },
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
            this.resourceUtilizationData = data.map(({ utilization, ...rest }) => {
                let obj = rest;
                obj.utilization = Math.round((utilization * 10000)) / 100;
                return obj;
            });
        },
        async getThroughput() {
            let data = await dataRequest("/api/experiment/throughput/processed/" + this.experimentID, "GET");
            let weeks = [];
            let week;
            data.forEach(entry => {
                if (weeks.indexOf(entry.week) == -1) {
                    weeks.push(entry.week);
                }
            })
            if (dayjs(weeks[0]).isBefore(dayjs(weeks[1]))) {
                week = weeks[0];
            } else {
                week = weeks[1];
            }
            this.throughputData = data.filter(e => e.week == week).map(({ iteration_number, replication, ...rest }) => {
                let obj = rest;
                obj.iteration_number = "Iteration " + iteration_number;
                obj.replication = "Replication " + replication;
                return obj;
            })
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
        async getJobTimelineData(iteration_number, replication) {
            let data = await dataRequest("/api/experiment/job-timeline/processed/" + this.experimentID + "-" + iteration_number + "-" + replication, "GET");
            this.jobTimelineData = data.map(e => {
                let arr = [
                    e.asset_name,
                    e.job_number.toString(),
                    dayjs(e.task_start).toDate(),
                    dayjs(e.task_end).toDate()
                ];
                return arr;
            });
            data.forEach(entry => {
                if (this.jobOptions.indexOf(entry.job_number) == -1) {
                    // this.selectedJobs.push(entry.job_number);
                    this.jobOptions.push(entry.job_number);
                }
            })
            // data.forEach(entry => {
            //     if (uniqueJobNumbers.indexOf(entry.job_number) == -1) {
            //         uniqueJobNumbers.push(entry.job_number);
            //         this.selectedJobs[entry.job_number] = true;
            //     }
            // })
            this.displayTimelineData = this.jobTimelineData.filter(e => this.selectedJobs.indexOf(e.job_number) !== -1);
        },
        async getData() {
            this.loading = true;
            await Promise.allSettled([
                this.getResourceUtilization(),
                this.getThroughput(),
                this.getCurrentlyRunning(),
                this.getExperimentData(),
                this.getGoalData()
            ])
            if (this.experimentData.scenario.scenario_id == 8) {
                let compatibleRuns = [{ iteration_number: 1, replication: 0, count: 0}]
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
                console.log(compatibleRuns);
                let bestRun = compatibleRuns.reduce((acc, value) => {
                    if (value.count > acc.count) {
                        return value;
                    } else {
                        return acc;
                    }
                });
                this.replicationSelection = bestRun;
                console.log(bestRun);
                await this.getJobTimelineData(bestRun.iteration_number, bestRun.replication);
            }
            this.loading = false;
            this.warning = (this.throughputData.length == 0 || this.resourceUtilizationData.length == 0);
        },
        handleJobSelectChange(e) {
            // let select = e.target;
            // let result = [];
            // let options = select && select.options;
            // let opt;

            // for (let i = 0, iLen = options.length; i < iLen; i++) {
            //     opt = options[i];

            //     if (opt.selected) {
            //         result.push(opt.value || opt.text);
            //     }
            // }
            // let keys = Object.keys(this.selectedJobs);
            // keys.forEach(key => {
            //     if (result.indexOf(key) !== -1) {
            //         this.selectedJobs[key] = true;
            //     } else {
            //         this.selectedJobs[key] = false;
            //     }
            // })
            console.log(this.selectedJobs);
            console.log(this.jobTimelineData);
            this.displayTimelineData = this.jobTimelineData.filter(e => this.selectedJobs.indexOf(parseInt(e[1])) !== -1);
            console.log(this.displayTimelineData);
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

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style>
.content h1 {
    text-align: left;
}
</style>