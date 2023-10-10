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
            <Collapsable title="Throughput" name="throughput" next="utilization" :heading="3" :defaultOpen="true"
                :reset="collapsableStatus['throughput']" @toggle-collapse="collapsableToggleChange">
                <div v-if="goalData" class="card">
                    <div>
                        <table class='grid-less'>
                            <tr>
                                <th>
                                    <h3>Use Throughput Target?</h3>
                                </th>
                                <td>
                                    <label class="switch">
                                        <input type="checkbox" name="demand-delivery-tue-input" :checked="throughputTarget && true"
                                            @input="setThroughputTarget">
                                        <span class="slider round"></span>
                                    </label>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div v-if="throughputTarget">
                        Use Simulation Data Where Throughput is
                        <select @change="e => throughputTarget.method = e.target.value"
                            :name="'utilization-gt-select-' + index">
                            <option :name="'utilization-high-' + index" :selected="throughputTarget.method == 'highest'"
                                :value="'highest'">Highest</option>
                            <option :name="'utilization-low-' + index" :selected="throughputTarget.method == 'lowest'"
                                :value="'lowest'">Lowest</option>
                            <option :name="'utilization-median-' + index" :selected="throughputTarget.method == 'median'"
                                :value="'median'">The Median</option>
                        </select>
                    </div>
                </div>
            </Collapsable>
            <Collapsable title="Equipment Utilization" name="utilization" next="turn-times" back="throughput"
                :defaultOpen="true" :heading="3" :reset="collapsableStatus['utilization']"
                @toggle-collapse="collapsableToggleChange">
                <div v-if="assetData && goalData">
                    <div class="space flex-left align-center">
                        <button @click="addUtilizationTarget"><i class="bi bi-plus"></i></button>
                        <h3 class="space">Add New Utilization Target</h3>
                        <p class="space">Min: 0 Max: 99.999</p>
                    </div>
                    <div>
                        <div v-for="(target, index) in utilizationTargets">
                            <button @click="utilizationTargets.splice(index, 1)"><i class="bi bi-trash-fill"></i></button>
                            Use Simulation Data Where
                            <select @change="e => utilizationTargets[index].target_id = parseInt(e.target.value)"
                                :name="'utilization-asset-select-' + index">
                                <option v-for="asset in assetData" :name="asset.asset_id + '-' + index"
                                    :selected="target.target_id == asset.asset_id" :value="asset.asset_id">{{
                                        asset.display_name }}</option>
                            </select>
                            Utilization is
                            <select @change="e => utilizationTargets[index].method = e.target.value"
                                :name="'utilization-gt-select-' + index">
                                <option :name="'utilization-gt-' + index" :selected="target.method == 'greater_than'"
                                    :value="'greater_than'">&gt
                                    (Greater Than)</option>
                                <option :name="'utilization-lt-' + index" :selected="target.method == 'less_than'"
                                    :value="'less_than'">
                                    &lt (Less Than)</option>
                                <option :name="'utilization-high-' + index" :selected="target.method == 'highest'"
                                    :value="'highest'">Highest</option>
                                <option :name="'utilization-low-' + index" :selected="target.method == 'lowest'"
                                    :value="'lowest'">Lowest</option>
                                <option :name="'utilization-median-' + index" :selected="target.method == 'median'"
                                    :value="'median'">The Median</option>
                            </select>
                            <template v-if="utilizationTargets[index].method == 'greater_than' || utilizationTargets[index].method == 'less_than'">
                                <input type="number" :name="'utilization-percent-' + index" :id="'utilization-percent-' + index"
                                    :value="target.utilization * 100" min="0" max="99.999"
                                    @input="e => utilizationTargets[index].utilization = parseFloat(e.target.value) / 100" />
                                <label :for="'utilization-percent-' + index">% (Percent)</label>
                            </template>
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
            throughputTarget: null,
            utilizationTargets: [],
            collapsableStatus: {}
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
            // console.log(data);
            this.assetData = data.map(e => e.asset);
        },
        async getGoalData() {
            let data = await dataRequest("/api/experiment/goal/" + this.experimentID, "GET");
            // console.log(data);
            this.goalData = data;
            if (data) {
                this.throughputTarget = data.filter(e => e.type == "throughput").map(({ last_modified, ...rest }) => rest)[0];
                this.utilizationTargets = data.filter(e => e.type == "utilization").map(({ last_modified, ...rest }) => rest);
            }
        },
        async getData() {
            this.getExperimentID()
            await this.getCurrentlyRunning();
            await this.getAssetData();
            await this.getGoalData();
        },
        addUtilizationTarget() {
            this.utilizationTargets.push({ experiment_goal_id: 'new-' + Math.floor(Math.random() * 1000000), experiment_id: this.experimentID, type: 'utilization', target_id: this.assetData[0].asset_id, method: 'greater_than', value: 0, priority: 2 })
        },
        setThroughputTarget({ target }) {
            if (target.checked) {
                this.throughputTarget = { experiment_goal_id: 'new-' + Math.floor(Math.random() * 1000000), experiment_id: this.experimentID, type: 'throughput', method: 'highest', priority: 1 };
            } else {
                this.throughputTarget = null;
            }
        },
        async saveGoalData() {
            let postTargets = this.utilizationTargets.filter(e => e.experiment_goal_id.toString().includes("new-")).map(({ experiment_goal_id, ...rest }) => rest);
            let putTargets = this.utilizationTargets.filter(e => !e.experiment_goal_id.toString().includes("new-"));
            let deleteTargets = this.goalData.filter(e => e.type == 'utilization' && this.utilizationTargets.findIndex(f => f.experiment_goal_id == e.experiment_goal_id) == -1).map(e => e.experiment_goal_id);
            if (this.throughputTarget) {
                if(this.throughputTarget.experiment_goal_id.toString().includes('new-')) {
                    delete this.throughputTarget.experiment_goal_id;
                    postTargets.push(this.throughputTarget);
                } else {
                    putTargets.push(this.throughputTarget);
                }
            } else {
                let throughputEntry = this.goalData.filter(e => e.type == "throughput")[0];
                console.log(throughputEntry)
                if (throughputEntry) {
                    deleteTargets.push(throughputEntry.experiment_goal_id);
                }
            }
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
        this.getData();
    }
}
</script>

<style>
.content h1 {
    text-align: left;
}
</style>