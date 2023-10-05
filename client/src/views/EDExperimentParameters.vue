<template>
    <WarningModal :display="warning">
        <p class="space">This experiment is current running. Input changes are not permitted. Please follow the link below
            to check on simulation status.</p>
        <router-link :to="'/experiments/design/simulation-start/' + this.experimentID" class="link-button">Simulation
            Status</router-link>
    </WarningModal>
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
            <Collapsable title="Throughput" name="throughput" next="utilization" :heading="3" tbd="true"
                :reset="collapsableStatus['throughput']" @toggle-collapse="collapsableToggleChange">
                <h3>Get Experiment With Highest Throughput?</h3>
                <label class="switch">
                    <input type="checkbox" checked name="stop-target-input" @input="">
                    <span class="slider round"></span>
                </label>
            </Collapsable>
            <Collapsable title="Equipment Utilization" name="utilization" next="turn-times" back="throughput"
                :defaultOpen="true" :heading="3" :reset="collapsableStatus['utilization']"
                @toggle-collapse="collapsableToggleChange">
                <div v-if="assetData">
                    <div class="space flex-left align-center">
                        <button @click="addUtilizationTarget"><i class="bi bi-plus"></i></button>
                        <h3 class="space">Add New Utilization Target</h3>
                        <p class="space">Min: 0 Max: 99.999</p>
                    </div>
                    <div>
                        <div v-for="(target, index) in utilizationTargets">
                            <button @click="utilizationTargets.splice(index, 1)"><i class="bi bi-dash"></i></button>
                            Use Simulation Data Where
                            <select @change="e => utilizationTargets[index].asset_id = parseInt(e.target.value)"
                                :name="'utilization-asset-select-' + index">
                                <option v-for="asset in assetData" :name="asset.asset_id + '-' + index"
                                    :selected="target.asset_id == asset.asset_id" :value="asset.asset_id">{{
                                        asset.display_name }}</option>
                            </select>
                            Utilization
                            <select @change="e => utilizationTargets[index].greater_than = (/true/).test(e.target.value)"
                                :name="'utilization-gt-select-' + index">
                                <option :name="'utilization-gt-' + index" :selected="target.greater_than" :value="true">&gt
                                    (Greater Than)</option>
                                <option :name="'utilization-lt-' + index" :selected="!target.greater_than" :value="false">
                                    &lt (Less Than)</option>
                            </select>
                            <input type="number" :name="'utilization-percent-' + index" :value="target.utilization * 100"
                                min="0" max="99.999"
                                @input="e => utilizationTargets[index].utilization = parseFloat(e.target.value) / 100" />
                            <label :for="'utilization-percent-' + index">% (Percent)</label>
                        </div>
                    </div>
                </div>
            </Collapsable>
            <Collapsable title="Job Turn Times" name="turn-times" back="utilization" :heading="3" tbd="true"
                :reset="collapsableStatus['turn-times']" @toggle-collapse="collapsableToggleChange">
                TBD
            </Collapsable>
            <div class="flex-right space"><button @click="clickBack">Back</button><button @click="clickNext">Next</button>
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
import dataRequest from '@/utils/dataRequest';
export default {
    data() {
        return {
            experimentID: null,
            assetData: null,
            goalData: null,
            warning: false,
            utilizationTargets: [],
            collapsableStatus: {},

        }
    },
    mixins: [titleMixin],
    title: 'Experiment Designer',
    components: { Sidebar, Header, ExperimentDesignerSidebar, ExperimentDesignerSidebar, Collapsable, WarningModal },
    methods: {
        getExperimentID() {
            this.experimentID = parseInt(window.location.href.split("/")[window.location.href.split("/").length - 1]);
        },
        async getCurrentlyRunning() {
            let data = await dataRequest("/api/experiment/running/" + this.experimentID, "GET");
            this.warning = data.running;
        },
        async getAssetData() {
            let data = await dataRequest("/api/experiment/asset/" + this.experimentID, "GET");
            console.log(data);
            this.assetData = data.map(e => e.asset);
        },
        async getGoalData() {
            let data = await dataRequest("/api/experiment/goal/" + this.experimentID, "GET");
            console.log(data);
            this.goalData = data;
            if (data) {
                this.utilizationTargets = data.map(({ created, ...rest }) => rest);
            }
        },
        addUtilizationTarget() {
            this.utilizationTargets.push({ experiment_goal_id: 'new-' + Math.floor(Math.random() * 1000000), utilization: 0, greater_than: true, asset_id: this.assetData[0].asset_id, experiment_id: this.experimentID })
            console.log(this.utilizationTargets);
        },
        async saveGoalData() {
            console.log(this.utilizationTargets);
            let postTargets = this.utilizationTargets.filter(e => e.experiment_goal_id.toString().includes("new-")).map(({ experiment_goal_id, ...rest }) => rest);
            let putTargets = this.utilizationTargets.filter(e => !e.experiment_goal_id.toString().includes("new-"));
            let deleteTargets = this.goalData.filter(e => this.utilizationTargets.findIndex(f => f.experiment_goal_id == e.experiment_goal_id) == -1).map(e => e.experiment_goal_id);
            await dataRequest("/api/experiment/goal/bulk", "POST", JSON.stringify({ data: postTargets }));
            await dataRequest("/api/experiment/goal/bulk", "PUT", JSON.stringify({ data: putTargets }));
            await dataRequest("/api/experiment/goal/bulk", "DELETE", JSON.stringify({ data: deleteTargets }));
        },
        createCollapsableObject() {
            const collapsableEls = document.querySelectorAll(".collapse-component");
            collapsableEls.forEach(element => {
                let name = element.id.split('collapsable-component-')[1]
                this.collapsableStatus[name] = { open: false, toggle: true }
            })
        },
        collapsableToggleChange({ name, open }) {
            this.collapsableStatus[name] = { open: open, toggle: !this.collapsableStatus[name].toggle };
        },
        clickBack() {
            this.$router.push("/experiments/design/inputs/" + this.experimentID);
        },
        async clickNext() {
            await this.saveGoalData();
            this.$router.push("/experiments/design/simulation-start/" + this.experimentID);
        }
    },
    mounted() {
        this.createCollapsableObject();
        this.getExperimentID()
        this.getCurrentlyRunning();
        this.getAssetData();
        this.getGoalData();
    }
}
</script>

<style>
.content h1 {
    text-align: left;
}
</style>