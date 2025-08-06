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
                    <VueMultiselect v-model="this.selectedJobs" :options="this.jobOptions" :multiple="true"
                        :close-on-select="false" placeholder="Select at least one job"
                        @update:model-value="handleJobSelectChange" :preselect-first="true">
                        <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single"
                                v-if="values.length" v-show="!isOpen">{{ values.length }} options selected</span></template>
                    </VueMultiselect>
                    <TimelineChart :data="displayTimelineData" />
                    <p>Best Match for Target(s) Iteration: {{ replicationSelection.iteration_number }} Replication: {{
                        replicationSelection.replication }}</p>
                </div>
                <PlotlyChart v-if="resourceUtilizationData" :data="resourceUtilizationData" id="2" title="Asset Utilization"
                    group="asset_name" x="AVG(util.processing_time )" xTitle="Average Processing Time (Minutes)"
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
            taskSequenceData: null,
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
            let data = await dataRequest("/api/experiment/simulation/status/" + this.experimentID, "GET");
            if (data.status == "RUNNING") {
                this.warning = true;
            }
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
        async getTaskSequenceData() {
            let data = await dataRequest("/api/experiment/task-sequence/" + this.experimentID, "GET");
            console.log(data);
            let currentEntry = data.find(e => e.task_sequence.start);
            let cellSequence = [];
            while(currentEntry) {
                if (cellSequence.indexOf(currentEntry.task_sequence.cell.display_name) == -1) {
                    cellSequence.push(currentEntry.task_sequence.cell.display_name);
                }
                currentEntry = data.find(e => e.task_sequence.task_sequence_id == currentEntry.task_sequence.next_operation);
            }
            this.taskSequenceData = cellSequence;
            console.log(this.taskSequenceData);
        },
        async getExperimentData() {
            let data = await dataRequest("/api/experiment/" + this.experimentID, "GET");
            // console.log(data);
            this.experimentData = data;
        },
        async getAssetData() {
            let data = await dataRequest("/api/experiment/asset/" + this.experimentID, "GET");
            // console.log(data);
            this.assetData = data.map(e => e.asset);
        },
        async getGoalData() {
            let data = await dataRequest("/api/experiment/goal/" + this.experimentID, "GET");
            // console.log(data);
            this.goalData = data;
        },
        async getJobTimelineData(iteration_number, replication) {
            let data = await dataRequest("/api/experiment/production-schedule/processed/" + this.experimentID + "-" + iteration_number + "-" + replication, "GET");
            let timelineData = data.map(e => {
                let arr = [
                    e.asset_name,
                    e.job_number.toString(),
                    dayjs(e.task_start).toDate(),
                    dayjs(e.task_end).toDate(),
                    e.cell_name
                ];
                return arr;
            });
            timelineData.sort((a, b) => this.taskSequenceData.indexOf(a[4]) - this.taskSequenceData.indexOf(b[4]));
            timelineData.map(e => e.splice(4, 1));
            this.jobTimelineData = timelineData;
            console.log(timelineData);
            console.log(this.jobTimelineData);
            data.forEach(entry => {
                if (this.jobOptions.indexOf(entry.job_number) == -1) {
                    this.jobOptions.push(entry.job_number);
                }
            })
            this.displayTimelineData = this.jobTimelineData.filter(e => this.selectedJobs.indexOf(e.job_number) !== -1);
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
                console.log("A")
                let maxCount = successes.reduce((acc, value) => value < acc ? value : acc).count;
                newReplications = replications.filter((e, index) => successes.find(f => f.iteration_number == e.iteration_number && f.replication == e.replication).count == maxCount);
            } else {
                console.log("B");
                newReplications = [replications[0]];
            }
            // console.log(newReplications);
            if (this.goalData.find(e => e.priority > goals[0].priority)) {
                return this.getReplicationsForPriority(newReplications, goals[0].priority);
            } else {
                return  newReplications.map(({ utilizationData, throughputData, ...rest }) => rest);
            }
        },
        async getCanonReplication() {
            let replications = this.throughputData.filter(e => e.iteration_number !== 'Iteration 0').map(({ iteration_number, replication, ...rest }) => {
                return { iteration_number: parseInt(iteration_number.replace('Iteration ', '')), replication: parseInt(replication.replace('Replication ', '')) }
            });
            replications.forEach(replication => {
                replication.utilizationData = this.resourceUtilizationData.filter(e => e.iteration_number == replication.iteration_number && e.replication == replication.replication);
                replication.throughputData = this.throughputData.filter(e => e.iteration_number == 'Iteration ' + replication.iteration_number && e.replication == 'Replication ' + replication.replication);
            })
            this.replicationSelection = this.getReplicationsForPriority(replications, 0)[0];
            await this.getJobTimelineData(this.replicationSelection.iteration_number, this.replicationSelection.replication);
        },
        async getData() {
            this.loading = true;
            await Promise.allSettled([
                this.getResourceUtilization(),
                this.getThroughput(),
                this.getCurrentlyRunning(),
                this.getExperimentData(),
                this.getTaskSequenceData(),
                this.getAssetData(),
                this.getGoalData()
            ])
            if (this.experimentData.scenario.scenario_id == 8) {
                await this.getCanonReplication();
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
            // console.log(this.selectedJobs);
            // console.log(this.jobTimelineData);
            this.displayTimelineData = this.jobTimelineData.filter(e => this.selectedJobs.indexOf(parseInt(e[1])) !== -1);
            // console.log(this.displayTimelineData);
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