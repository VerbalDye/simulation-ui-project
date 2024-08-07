<template>
    <LoadingModal :display="loading" :estimatedLoadingTime="5000" />
    <Header />
    <div class="site-container">
        <Sidebar />
        <div class="content">
            <h1>Process Time Defaults</h1>
            <div>
                <!-- <VueMultiselect v-model="selectedAssets"
                    :options="this.formattedAssets" :multiple="true" :close-on-select="false"
                    placeholder="Select at least one model"
                    @update:model-value="handleModelSelectChange(selectedAssets[0].asset_id)" :preselect-first="true">
                    <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single"
                            v-show="!isOpen">
                            options
                            selected</span></template>
                </VueMultiselect>
                <VueMultiselect v-model="this.processTimeSettings.selectedModels[selectedAssets[0].asset_id]"
                    :options="this.processTimeSettings.modelData" :multiple="true" :close-on-select="false"
                    placeholder="Select at least one model"
                    @update:model-value="handleModelSelectChange(selectedAssets[0].asset_id)" :preselect-first="true">
                    <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single"
                            v-show="!isOpen">
                            options
                            selected</span></template>
                </VueMultiselect>
                <table class="grid-less">
                    <tr>
                        <th><i class="bi bi-hash"></i> Number of Samples*</th>
                        <td>
                            <input type="number"
                                :value="Object.keys(processTimeSettings.elements[selectedAssets[0].asset_id].values).length"
                                class="small-number-input" :name="'samples-' + selectedAssets[0].asset_id"
                                @input="handleNumberOfSamplesChange(selectedAssets[0].asset_id, processTimeSettings.selectedModels[selectedAssets[0].asset_id][0], $event)">
                        </td>
                    </tr>
                    <tr>
                        <th><i class="bi bi-clock-fill"></i> Enter Processing
                            Times
                            (minutes)*</th>
                        <td>
                            <div class="flex-left">
                                <input
                                    v-for="(value, key) in this.processTimeSettings.elements[selectedAssets[0].asset_id].values"
                                    class="small-number-input" type="number" :value="value" :name="'times-' + key"
                                    @input="handleProcessTimeDataChange(key, $event)">
                            </div>
                        </td>
                    </tr>
                </table> -->
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
            assetData: {},
            formattedAssets: {},
            experimentID: 2,
            selectedAssets: [],
            processTimeSettings: {
                selectedModels: []
            }
        }
    },
    mixins: [titleMixin],
    title: 'Process Time Default',
    components: { Sidebar, Header, VueMultiselect },
    methods: {
        async getAssetData() {
            let data = await dataRequest("/api/experiment/asset/" + this.experimentID, "GET");
            console.log(data);
            this.assetData = data.map(e => e.asset);
            this.formattedAssets = data.map(e => e.asset.display_name);
            console.log(this.formattedAssets);
        },
        async getProcessTimeData() {
            // let data = await dataRequest("/api/")
        }
    },
    mounted() {
        this.getAssetData();
    }
}
</script>

<style></style>