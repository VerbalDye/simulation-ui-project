<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <ExperimentDesignerSidebar currentPage="4" />
        <div class="content">
            <h1>5. Simulation Run</h1>
            <table v-if="status" class="grid-less">
                <tr>
                    <th><i class="bi bi-activity"></i> Simulation Status</th>
                    <td>{{ status }}</td>
                </tr>
                <tr v-if="status == 'Running'">
                    <th><i class="bi bi-clock-fill"></i> Start:</th>
                    <td>{{ dayjs(startTime).format("YYYY-MM-DD hh:mm:ss") }}</td>
                </tr>
            </table>
            <!-- <div v-else>
                <button @click="startSimulation">Run Simulation</button>
            </div>
            <div v-if="status == 'Finished'">
                <button @click="startSimulation">Rerun Simulation</button>
            </div> -->
            <div id="animation-container"
                style="width: 1200px; height: 700px; border: 1px solid blue; position: relative;"></div>
            <div>
                <button id="run-button" @click="runAnimation">Start?</button>
            </div>
            <div class="flex-right space"><button @click="clickBack">Back</button><button
                    @click="clickNext">Next</button></div>
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
export default {
    data() {
        return {
            experimentID: null,
            startTime: null,
            endTime: null,
            currentTime: dayjs(),
            dayjs: dayjs,
            status: null,
            wasRunning: false,
            interval: null,
            apiKey: null,
            cloudClient: null
        }
    },
    mixins: [titleMixin],
    title: 'Experiment Designer',
    components: { Sidebar, Header, ExperimentDesignerSidebar, ExperimentDesignerSidebar },
    methods: {
        getExperimentID() {
            this.experimentID = window.location.href.split("/")[window.location.href.split("/").length - 1];
        },
        async getRunning() {
            // let data = await dataRequest("/api/experiment/running/" + this.experimentID, "GET");
            // if (data.running && !this.wasRunning) {
            //     this.startTime = data.started;
            //     this.status = "Running";
            //     this.wasRunning = true;
            // } else if (!data.running && this.wasRunning) {
            //     this.endTime = dayjs();
            //     this.status = "Finished";
            // }
            let data = await dataRequest("/api/experiment/simulation/status/" + this.experimentID, "GET");
            console.log(data);
            if (data.status == "COMPLETED") {
                this.status = 'Finished';
            } else if (data.status == "RUNNING") {
                this.status = 'Running';
            }
        },
        clickBack() {
            this.$router.push("/experiments/design/experiment-parameters/" + this.experimentID);
        },
        clickNext() {
            this.$router.push("/experiments/design/results-review/" + this.experimentID);
        },
        // async startSimulation() {
        //     this.status = 'Running';
        //     this.startTime = dayjs();
        //     await dataRequest("/api/experiment/simulation/start/" + this.experimentID, "POST", JSON.stringify({ num_replications: 5 }));
        //     this.statusInterval();
        // },
        async startSimulation() {
            this.status = 'Running';
            this.startTime = dayjs();
            await dataRequest("/api/experiment/simulation/start/" + this.experimentID, "POST", JSON.stringify({ num_replications: 5 }));
            this.statusInterval();
        },
        statusInterval() {
            this.interval = setInterval(async () => {
                await this.getRunning();
                if (this.status !== "Running") {
                    clearInterval(this.interval);
                    window.alert("Simulation Run Complete!");
                }
            }, 10000)
        },
        async getAPIKey() {
            let data = await dataRequest("/api/experiment/simulation/key", "GET");
            console.log(data);
            this.apiKey = data.key;
        },
        async runAnimation() {
            // runButton = document.getElementById("run-button");
            // runButton.disabled = true;
            let version = await this.cloudClient.getLatestModelVersion("PV Fluid V1");
            let inputs = this.cloudClient.createDefaultInputs(version);
            inputs.setInput("EXPERIMENT_ID", this.experimentID);
            inputs.setInput("ITERATION_ID", 0);
            inputs.setInput("NUM_REPLICATION", 3);
            inputs.setInput("DATABASE_CONNECTION_URL", "jdbc:mysql://address=(host=172.28.0.56)(port=3306)(user=PVFAdmin)(password=1)/pvfluid_test");
            let runID = Math.floor(Math.random() * 1000);
            console.log(runID)
            inputs.setInput("RUN_ID", runID);
            await this.cloudClient.startAnimation(inputs, "animation-container");
            return animation.waitForCompletion();
        }
    },
    async mounted() {
        this.$loadScript("http://172.28.0.58/assets/js-client-8.5.0/cloud-client.js")
            .then(async () => {
                await this.getAPIKey();
                this.cloudClient = CloudClient.create(this.apiKey, "http://172.28.0.58");
            })
            .catch(() => {
                // Failed to fetch script
                console.log("Oops");
            });
        this.getExperimentID();
        await this.getRunning();
        if (this.status == 'Running') {
            this.statusInterval()
        }
    }
}
</script>

<style>
.content h1 {
    text-align: left;
}
</style>