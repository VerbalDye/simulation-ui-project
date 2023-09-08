<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <ExperimentDesignerSidebar currentPage="4" />
        <div class="content">
            <h1>5. Simulation Run</h1>
            <button @click="startSimulation">Run Simulation</button>
            <table v-if="startTime" class="grid-less">
                <tr>
                    <th><i class="bi bi-hash"></i> Start:</th>
                    <td>{{ dayjs(startTime).format("YYYY-MM-DD hh:mm:ss") }}</td>
                </tr>
                <tr>
                    <th><i class="bi bi-hash"></i> Running:</th>
                    <td>{{ currentTime.diff(startTime, 'minute') }} minutes</td>
                </tr>
                <tr>
                    <th><i class="bi bi-hash"></i> Iterations:</th>
                    <td>{{ currentTime.diff(startTime, 'minute') }} minutes</td>
                </tr>
            </table>
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
            currentTime: dayjs(),
            dayjs: dayjs
        }
    },
    mixins: [titleMixin],
    title: 'Experiment Designer',
    components: { Sidebar, Header, ExperimentDesignerSidebar, ExperimentDesignerSidebar },
    methods: {
        getExperimentID() {
            this.experimentID = window.location.href.split("/")[window.location.href.split("/").length - 1];
        },
        clickBack() {
            this.$router.push("/experiments/design/experiment-parameters/" + this.experimentID);
        },
        clickNext() {
            this.$router.push("/experiments/design/results-review/" + this.experimentID);
        },
        async startSimulation() {
            await dataRequest("/api/experiment/simulation/start/" + this.experimentID, "POST");
            this.startTime = dayjs();
        }
    },
    mounted() {
        this.getExperimentID();
        setInterval(() => {
            this.currentTime = dayjs()
        }, 1000)
    }
}
</script>

<style>
.content h1 {
    text-align: left;
}
</style>