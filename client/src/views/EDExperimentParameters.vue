<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <ExperimentDesignerSidebar currentPage="3" />
        <div class="content">
            <h1>4. Experiment Parameters</h1>
            <table>
                <tr>
                    <th><i class="bi bi-hash"></i> Number of weeks per iteration</th>
                    <td><input type="number" value="3"></td>
                </tr>
                <tr>
                    <th><i class="bi bi-clock-fill"></i> Maximum experiment duration (minutes)</th>
                    <td><input type="number" value="30"></td>
                </tr>
                <tr>
                    <th><i class="bi bi-sign-stop-fill"></i> Stop when target is reached?</th>
                    <td><input type="checkbox"></td>
                </tr>
            </table>
            <div><i class="bi bi-bullseye"></i> Target(s)</div>
            <div class="flex-between">
                <h2>Throughput</h2>
                <i class="bi bi-plus-circle-fill"></i>
            </div>
            <div class="flex-between">
                <h2>Equipment Utilization</h2>
                <i class="bi bi-plus-circle-fill"></i>
            </div>
            <div class="flex-between">
                <h2>Job Turn Times</h2>
                <i class="bi bi-plus-circle-fill"></i>
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
            this.$router.push("/experiments/design/inputs/" + window.location.href.split("/")[window.location.href.split("/").length - 1]);
        },
        clickNext() {
            this.$router.push("/experiments/design/simulation-start/" + window.location.href.split("/")[window.location.href.split("/").length - 1]);
        }
    }
}
</script>

<style>
.content h1 {
    text-align: left;
}
</style>