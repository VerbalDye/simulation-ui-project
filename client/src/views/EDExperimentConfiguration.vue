<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <ExperimentDesignerSidebar currentPage="1" />
        <div class="content">
            <h1>2. Experiment Configuration</h1>
            <table v-if="this.experimentData" id="scenario-info-table" class="grid-less">
                <tr>
                    <th>Scenario:</th>
                    <td>{{ this.experimentData.scenario.scenario_name }}</td>
                </tr>
                <tr>
                    <th>Analysis Type:</th>
                    <td>{{ this.scenarioData.analysisTypes }}</td>
                </tr>
                <tr>
                    <th>Experiment Type:</th>
                    <td>{{ this.scenarioData.experimentTypes }}</td>
                </tr>
                <tr>
                    <th>Department(s):</th>
                    <td>{{ this.scenarioData.departments }}</td>
                </tr>
                <tr>
                    <th>Created By:</th>
                    <td>{{ this.experimentData.user.email }}</td>
                </tr>
                <tr>
                    <th>Created At:</th>
                    <td>{{ this.parseDate(this.experimentData.created) }}</td>
                </tr>
                <tr>
                    <th>Last Modified By:</th>
                    <td>{{ this.parseDate(this.experimentData.last_modified) }}</td>
                </tr>
            </table>
            <div class="card">
                <table v-if="this.experimentData" class="grid-less">
                    <tr>
                        <th>Experiment ID:</th>
                        <td>{{ this.experimentData.experiment_id }}</td>
                    </tr>
                    <tr>
                        <th>Experiment Name*:</th>
                        <td><input type="text" id="experiment-name-input" :value="this.experimentData.experiment_name"></td>
                    </tr>
                </table>
            </div>
            <div class="flex-right"><button @click="clickBack">Back</button><button @click="clickNext">Next</button></div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import titleMixin from '../mixins/titleMixin';
import Sidebar from '@/components/Sidebar.vue';
import ExperimentDesignerSidebar from '@/components/ExperimentDesignerSidebar.vue';
import dataRequest from '@/utils/dataRequest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
export default {
    data() {
        return {
            experimentID: null,
            experimentData: null,
            scenarioData: {
                analysisTypes: "",
                experimentTypes: "",
                departments: ""
            },
        }
    },
    mixins: [titleMixin],
    title: 'Experiment Designer',
    components: { Sidebar, Header, ExperimentDesignerSidebar, ExperimentDesignerSidebar },
    methods: {
        getExperimentID() {
            this.experimentID = window.location.href.split("/")[window.location.href.split("/").length - 1];
        },
        async getExperimentData() {
            let data = await dataRequest("/api/experiment/" + this.experimentID + "GET");
            this.experimentData = data;
            this.createScenarioData();
        },
        createScenarioData() {
            let analysis_types = [];
            let experiment_types = [];
            let departments = [];
            this.experimentData.scenario.scenario_filters.forEach(filter => {
                if (!analysis_types.includes(filter.analysis_type)) {
                    analysis_types.push(filter.analysis_type);
                }
                if (!experiment_types.includes(filter.experiment_type)) {
                    experiment_types.push(filter.experiment_type);
                }
                if (!departments.includes(filter.department)) {
                    departments.push(filter.department);
                }
            });
            this.scenarioData.analysisTypes = analysis_types.join(', ');
            this.scenarioData.experimentTypes = experiment_types.join(', ');
            this.scenarioData.departments = departments.join(', ');
        },
        parseDate(date) {
            return dayjs(date).tz(dayjs.tz.guess()).format("M-D-YYYY H:mm:s");
        },
        clickBack() {
            // if (window.confirm("Are you sure you want to go back?\nChanges to experiment will be lost.")) {
                // fetch("/api/experiment/" + this.experimentID, {
                //     method: "DELETE"
                // })
                //     .then(response => {
                //         if (response.status == 200) {
                //             response.json()
                //                 .then(data => {
                //                     console.log(data);
                //                     this.$router.push("/experiments/design/scenario");
                //                 })
                //         } else {

                //             // Error Handling
                //             let html = "It seems an unknown error has occurred. Check your connection and try agian. \n" + response.status + " " + response.responseText;
                //             window.alert(html);
                //         }
                //     }).catch(function (error) {

                //         // Informs user of failure
                //         let html = "We appear to be having trouble reaching the Database. Check your connection and try agian. \n" + error;
                //         window.alert(html);
                //     });
                this.$router.push("/experiments/design/scenario");
            // }
        },
        async clickNext() {
            let experiment_name = document.getElementById('experiment-name-input').value;
            await dataRequest("/api/experiment/" + this.experimentID, "PUT", JSON.stringify({ experiment_name: experiment_name }))
            this.$router.push("/experiments/design/inputs/" + this.experimentID);
        }
    },
    mounted() {
        this.getExperimentID();
        this.getExperimentData();
    }
}
</script>

<style>
.content h1 {
    text-align: left;
}
</style>