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
                <tr>
                    <th><i class="bi bi-clock-fill"></i> Start:</th>
                    <td>{{ dayjs(startTime).format("YYYY-MM-DD hh:mm:ss") }}</td>
                </tr>
                <tr v-if="endTime">
                    <th><i class="bi bi-sign-stop-fill"></i> Finished:</th>
                    <td>{{ dayjs(endTime).format("YYYY-MM-DD hh:mm:ss") }}</td>
                </tr>
                <tr>
                    <th><i class="bi bi-stopwatch-fill"></i> Time Running:</th>
                    <td>{{ currentTime.diff(startTime, 'minute') }} minutes</td>
                </tr>
                <!-- <tr>
                    <th><i class="bi bi-hash"></i> Iterations:</th>
                    <td>{{ currentTime.diff(startTime, 'minute') }} minutes</td>
                </tr> -->
            </table>
            <div v-else>
                <button @click="startSimulation">Run Simulation</button>
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
            interval: null
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
            let data = await dataRequest("/api/experiment/running/" + this.experimentID, "GET");
            if (data.running && !this.wasRunning) {
                this.startTime = data.started;
                this.status = "Running";
                this.wasRunning = true;
            } else if (!data.running && this.wasRunning) {
                this.endTime = dayjs();
                this.status = "Finished";
            }
        },
        clickBack() {
            this.$router.push("/experiments/design/experiment-parameters/" + this.experimentID);
        },
        clickNext() {
            this.$router.push("/experiments/design/results-review/" + this.experimentID);
        },
        async startSimulation() {
            this.status = 'Running';
            this.startTime = dayjs();
            await dataRequest("/api/experiment/simulation/start/" + this.experimentID, "POST", JSON.stringify({ num_replications: 5 }));
            this.status = 'Finished';
            this.endTime = dayjs();
            clearInterval(this.interval);
            window.alert("Simulation Run Complete!");
        }
    },
    mounted() {
        this.getExperimentID();
        this.getRunning();
        this.interval = setInterval(async () => {
            this.currentTime = dayjs();
            if (this.wasRunning) {
                await this.getRunning();
            } 
            if (this.status == "Finished") {
                clearInterval(this.interval);
                window.alert("Simulation Run Complete!");
            }
        }, 10000)
    }
}
</script>

<style>
.content h1 {
    text-align: left;
}
</style>