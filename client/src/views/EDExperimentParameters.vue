<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <ExperimentDesignerSidebar currentPage="3" />
        <div class="content">
            <h1>4. Experiment Parameters</h1>
            <div class="card">
                <table class="grid-less">
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
                        <td>
                            <label class="switch">
                                <input type="checkbox" checked name="stop-target-input" @input="">
                                <span class="slider round"></span>
                            </label>
                        </td>
                    </tr>
                </table>
            </div>
            <h2><i class="bi bi-bullseye"></i> Target(s)</h2>
            <Collapsable title="Throughput" name="throughput" next="utilization" :defaultOpen="true" :heading="3">
                TBD
            </Collapsable>
            <Collapsable title="Equipment Utilization" name="utilization" next="turn-times" back="throughput" :heading="3">
                TBD
            </Collapsable>
            <Collapsable title="Job Turn Times" name="turn-times" back="utilization" :heading="3">
                TBD
            </Collapsable>
            <div class="flex-right"><button @click="clickBack">Back</button><button @click="clickNext">Next</button></div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import titleMixin from '../mixins/titleMixin';
import Sidebar from '@/components/Sidebar.vue';
import ExperimentDesignerSidebar from '@/components/ExperimentDesignerSidebar.vue';
import Collapsable from '@/components/Collapsable.vue';
export default {
    data() {
        return {

        }
    },
    mixins: [titleMixin],
    title: 'Experiment Designer',
    components: { Sidebar, Header, ExperimentDesignerSidebar, ExperimentDesignerSidebar, Collapsable },
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