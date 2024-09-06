<template>
    <LoadingModal :display="loading" :estimatedLoadingTime="5000" />
    <Header />
    <div class="site-container">
        <Sidebar />
        <div class="content">
            <h1>Process Time Defaults</h1>
            <div>
                <VueMultiselect v-model="selectedAssets"
                    :options="this.formattedAssets" :multiple="true" :close-on-select="false"
                    placeholder="Select at least one model"
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
                <VueMultiselect v-model="this.selectedModels"
                    :options="this.modelData" :multiple="true" :close-on-select="false"
                    placeholder="Select at least one model"
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
                <table class="grid-less">
                    <tr>
                        <th><i class="bi bi-hash"></i> Number of Samples*</th>
                        <td>
                            <input type="number"
                                :value="this.processingTimes.length"
                                class="small-number-input" :name="'number-of-samples-selection'"
                                @input="handleNumberOfSamplesChange">
                        </td>
                    </tr>
                    <tr>
                        <th><i class="bi bi-clock-fill"></i> Enter Processing
                            Times
                            (minutes)*</th>
                        <td>
                            <div class="flex-left">
                                <input
                                    v-for="(time, index) in processingTimes"
                                    class="small-number-input" type="number" :value="time" :name="'times-' + index"
                                    @input="handleProcessTimeDataChange">
                            </div>
                        </td>
                    </tr>
                </table>
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
            processingTimeData: []
        }
    },
    mixins: [titleMixin],
    title: 'Process Time Default',
    components: { Sidebar, Header, VueMultiselect },
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
            let data2 = await dataRequest("/api/process-time/", "POST", {model_number: 2875120, asset_id: 1});
            console.log(data2);
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
        handleProcessTimeDataChange() {

        },
        handleSaveProcessTimes() {
            window.alert("Saved!");
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