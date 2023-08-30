<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <ExperimentDesignerSidebar currentPage="4" />
        <div class="content">
            <h1>5. Simulation Run</h1>
            <button @click="startSimulation">Run Simulation</button>
            <table>
                <tr>
                    <th><i class="bi bi-hash"></i> Start:</th>
                    <td>2023-07-10 07:30:00</td>
                </tr>
                <tr>
                    <th><i class="bi bi-hash"></i> Running:</th>
                    <td>4 minutes</td>
                </tr>
                <tr>
                    <th><i class="bi bi-hash"></i> Iterations:</th>
                    <td>4 minutes</td>
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
export default {
    data() {
        return {

        }
    },
    mixins: [titleMixin],
    title: 'Experiment Designer',
    components: { Sidebar, Header, ExperimentDesignerSidebar, ExperimentDesignerSidebar },
    methods: {
        clickBack() {
            this.$router.push("/experiments/design/experiment-parameters/" + window.location.href.split("/")[window.location.href.split("/").length - 1]);
        },
        clickNext() {
            this.$router.push("/experiments/design/results-review/" + window.location.href.split("/")[window.location.href.split("/").length - 1]);
        },
        async startSimulation() {
            await dataRequest("/api/simulation/start", "POST");
        }
    }
}
</script>

<style>
.content h1 {
    text-align: left;
}
</style>