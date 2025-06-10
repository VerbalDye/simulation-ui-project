<template>
    <LoadingModal :display="loading" :estimatedLoadingTime="5000" />
    <Header />
    <div class="site-container">
        <Sidebar />
        <AdminSidebar />
        <div class="content">
            <h1>Process Time Defaults</h1>
            <div>
                <VueMultiselect v-model="selectedAssets" :options="this.formattedAssets" :multiple="true"
                    :close-on-select="false" placeholder="Select at least one model"
                    @update:model-value="handleAssetSelectChange()" :preselect-first="true">
                    <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single"
                            v-show="!isOpen">
                            options
                            selected</span></template>
                </VueMultiselect>
                <div>
                    <button @click="e => this.selectedAssets = this.formattedAssets">Select All</button>
                    <button @click="e => this.selectedAssets = []">Select None</button>
                </div>
                <VueMultiselect v-model="this.selectedModels" :options="this.modelData" :multiple="true"
                    :close-on-select="false" placeholder="Select at least one model"
                    @update:model-value="handleModelSelectChange()" :preselect-first="true">
                    <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single"
                            v-show="!isOpen">
                            options
                            selected</span></template>
                </VueMultiselect>
                <div>
                    <button @click="e => this.selectedModels = this.modelData">Select All</button>
                    <button @click="e => this.selectedModels = []">Select None</button>
                </div>
                <label for="discrete-select" class="radio-container">
                    <input id="discrete-select" type="radio" name="discrete-continuous" class="checkbox"
                        :checked="this.discreteMode" @input="e => this.discreteMode = true">
                    <span class="radio-checkmark"></span>
                    Discrete
                </label>
                <label for="continuous-select" class="radio-container">
                    <input id="continuous-select" type="radio" name="discrete-continuous" class="checkbox"
                        :checked="!this.discreteMode" @input="e => this.discreteMode = false">
                    <span class="radio-checkmark"></span>
                    Continuous
                </label>
                <div v-if="discreteMode">
                    <table class="grid-less">
                        <tr>
                            <th><i class="bi bi-hash"></i> Number of Samples*</th>
                            <td>
                                <input type="number" :value="this.processingTimes.length" class="small-number-input"
                                    :name="'number-of-samples-selection'" @input="handleNumberOfSamplesChange">
                            </td>
                        </tr>
                        <tr>
                            <th><i class="bi bi-clock-fill"></i> Enter Processing
                                Times
                                (minutes)*</th>
                            <td>
                                <div class="flex-left">
                                    <input v-for="(time, index) in processingTimes" class="small-number-input"
                                        type="number" :value="time" :name="'times-' + index"
                                        @input="handleProcessTimeDataChange($event, index)">
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-else>
                    <table class="grid-less">
                        <tr>
                            <th><i class="bi bi-bar-chart-line-fill"></i>Distribution Type*</th>
                            <td>
                                <select name="distribution-type-apply-all-advanced"
                                    id="distribution-type-apply-all-advanced"
                                    @change="e => this.continuousData.distribution = e.target.value">
                                    <option value="Lognormal" selected>Lognormal</option>
                                    <option value="Normal">Normal</option>
                                    <option value="Beta">Beta</option>
                                    <option value="Triangular">Triangular</option>
                                    <option value="Uniform">Uniform</option>
                                    <option value="Exponential">Exponential</option>
                                </select>
                            </td>
                        </tr>
                        <tr v-if="this.continuousData.distribution !== 'Normal'">
                            <th><i class="bi bi-dash-lg"></i> Min (minutes)*</th>
                            <td>
                                <input type="number" value="0" class="small-number-input"
                                    @change="e => this.continuousData.min = e.target.value" />
                            </td>
                        </tr>
                        <tr
                            v-if="this.continuousData.distribution == 'Beta' || this.continuousData.distribution == 'Triangular' || this.continuousData.distribution == 'Uniform'">
                            <th><i class="bi bi-plus-lg"></i> Max (minutes)*</th>
                            <td>
                                <input type="number" value="0" class="small-number-input"
                                    @change="e => this.continuousData.max = e.target.value" />
                            </td>
                        </tr>
                        <tr v-if="this.continuousData.distribution !== 'Uniform'">
                            <th>
                                {{ this.continuousData.distribution === 'Lognormal' || this.continuousData.distribution == 'Normal' ? "Mu" :
                                    "" }}
                                {{ this.continuousData.distribution === 'Beta' ? "p" : "" }}
                                {{ this.continuousData.distribution === 'Triangular' ? "Median" : "" }}
                                {{ this.continuousData.distribution === 'Exponential' ? "Lambda" : "" }}
                            </th>
                            <td>
                                <input type="number" class="small-number-input"
                                    @change="e => this.continuousData.param1 = e.target.value" value="0">
                            </td>
                        </tr>
                        <tr
                            v-if="this.continuousData.distribution === 'Lognormal' || this.continuousData.distribution == 'Normal' || this.continuousData.distribution == 'Beta'">
                            <th>
                                {{ this.continuousData.distribution === 'Lognormal' || this.continuousData.distribution == 'Normal' ? "Sigma"
                                    : "" }}
                                {{ this.continuousData.distribution === 'Beta' ? "q" : "" }}
                            </th>
                            <td>
                                <input type="number" class="small-number-input"
                                    @change="e => this.continuousData.param2 = e.target.value" value="0">
                            </td>
                        </tr>
                    </table>
                </div>
                <button @click="handleSaveProcessTimes">Save</button>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import titleMixin from '../mixins/titleMixin';
import Sidebar from '@/components/Sidebar.vue';
import VueMultiselect from 'vue-multiselect';
import AdminSidebar from '@/components/AdminSidebar.vue';
import auth from '../utils/auth';
import dataRequest from '@/utils/dataRequest';
import dayjs from 'dayjs';
export default {
    data() {
        return {
            assetData: [],
            formattedAssets: [],
            experimentID: 2,
            selectedAssets: [],
            modelData: [],
            selectedModels: [],
            processingTimes: [],
            currentEntries: [],
            processingTimeData: [],
            discreteMode: true,
            continuousData: {
                distribution: 'Lognormal',
                min: 0,
                max: 0,
                param1: 0,
                param2: 0
            }
        }
    },
    mixins: [titleMixin],
    title: 'Process Time Default',
    components: { AdminSidebar, Sidebar, Header, VueMultiselect },
    methods: {
        async getAssetData() {
            let data = await dataRequest("/api/experiment/asset/" + this.experimentID, "GET");
            // console.log(data);
            this.assetData = data.map(e => e.asset);
            this.formattedAssets = data.map(e => e.asset.display_name);
            console.log(this.formattedAssets);
        },
        async getModelData() {
            let data = await dataRequest("/api/model/", "GET");
            // console.log(data);
            this.modelData = data.map(e => e.model_number);
        },
        async getProcessTimeData() {
            let data = await dataRequest("/api/experiment/process-time/" + this.experimentID, "GET");
            console.log(data);
            this.processingTimeData = data;
        },
        handleAssetSelectChange() {
            this.handleSelectionChange();
        },
        handleModelSelectChange() {
            this.handleSelectionChange();
        },
        handleSelectionChange() {
            let selectedAssetIDs = [];
            this.selectedAssets.forEach(asset => {
                selectedAssetIDs.push(this.assetData.find(e => e.display_name == asset).asset_id)
            })
            console.log(selectedAssetIDs);
            this.currentEntries = this.processingTimeData.filter(e => selectedAssetIDs[0] == e.process_time.asset_id && this.selectedModels[0] == e.process_time.model_number);
            console.log(this.currentEntries);
            this.processingTimes = [];
            this.currentEntries.forEach(processingTime => {
                this.processingTimes.push(processingTime.process_time.process_time);
            })
        },
        handleNumberOfSamplesChange(e) {
            while (parseInt(e.target.value) != this.processingTimes.length) {
                if (parseInt(e.target.value) > this.processingTimes.length) {
                    this.processingTimes.push(0);
                } else if (parseInt(e.target.value) < this.processingTimes.length) {
                    this.processingTimes.pop();
                }
            }
        },
        handleProcessTimeDataChange(e, index) {
            this.processingTimes[index] = e.target.value;
        },
        async handleSaveProcessTimes() {
            let selectedAssetIDs = [];
            this.selectedAssets.forEach(asset => {
                selectedAssetIDs.push(this.assetData.find(e => e.display_name == asset).asset_id)
            })
            let body = {
                model_number: this.selectedModels,
                asset_id: selectedAssetIDs
            }
            if (this.discreteMode) {
                body.process_time = this.processingTimeData
                console.log(body);
                let { status } = await dataRequest("/api/process-time/change-default/discrete", "POST", JSON.stringify(body), { statusOnly: true });
                if (status == 200) {
                    window.alert("Saved successfully.")
                } else {
                    windwo.alert("Something went wrong during the saving process.")
                }
            } else {
                body.process_time = this.continuousData;
                console.log(body);
                let { status } = await dataRequest("/api/process-time/change-default/continuous", "POST", JSON.stringify(body), { statusOnly: true });
                if (status == 200) {
                    window.alert("Saved successfully.")
                } else {
                    windwo.alert("Something went wrong during the saving process.")
                }
            }
        }
    },
    mounted() {
        this.getAssetData();
        this.getModelData();
        this.getProcessTimeData();
    }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style></style>