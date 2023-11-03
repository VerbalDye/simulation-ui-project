<template>
    <LoadingModal :display="loading" :estimatedLoadingTime="5000" />
    <Header />
    <div class="site-container">
        <Sidebar />
        <div class="content">
            <h1>Add Asset</h1>
            <form @submit.prevent="handleAddAsset">
                <table class="grid-less">
                    <tr>
                        <th><label for="asset-name-input">Name:</label></th>
                        <td><input type="text" id="asset-name-input" name="asset-name-input" /></td>
                    </tr>
                    <tr>
                        <th><label for="asset-type-select">Asset Type:</label></th>
                        <td>
                            <select id="asset-type-select" name="asset-type-select">
                                <option value="EQUIPMENT_MACHINE" selected>Equipment/Machine</option>
                                <option value="STORAGE_AREA">Storage Area</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th><label for="asset-xpos-input">X Position (Feet):</label></th>
                        <td><input type="number" id="asset-xpos-input" name="asset-xpos-input" value="0"
                                class="small-number-input" /></td>
                    </tr>
                    <tr>
                        <th><label for="asset-ypos-input">Y Position (Feet):</label></th>
                        <td><input type="number" id="asset-ypos-input" name="asset-ypos-input" value="0"
                                class="small-number-input" /></td>
                    </tr>
                    <tr>
                        <th><label for="asset-zpos-input">Z Position (Feet):</label></th>
                        <td><input type="number" id="asset-zpos-input" name="asset-zpos-input" value="0"
                                class="small-number-input" /></td>
                    </tr>
                    <tr>
                        <th><label for="asset-width-input">Width (Feet):</label></th>
                        <td><input type="number" min="0" id="asset-width-input" name="asset-width-input" value="5"
                                class="small-number-input" /></td>
                    </tr>
                    <tr>
                        <th><label for="asset-length-input">Length (Feet):</label></th>
                        <td><input type="number" min="0" id="asset-length-input" name="asset-length-input" value="5"
                                class="small-number-input" /></td>
                    </tr>
                    <tr>
                        <th><label for="asset-height-input">Height (Feet):</label></th>
                        <td><input type="number" min="0" id="asset-height-input" name="asset-height-input" value="5"
                                class="small-number-input" /></td>
                    </tr>
                    <tr>
                        <th><label for="asset-capacity-input">Capacity:</label></th>
                        <td><input type="number" min="0" step="1" id="asset-capacity-input" name="asset-capacity-input"
                                value="1" class="small-number-input" />
                        </td>
                    </tr>
                    <tr>
                        <th><label for="asset-operation-select">Associated Operation:</label></th>
                        <td>
                            <select id="asset-operation-select" name="asset-type-select" @change="handleOperationChange">
                                <option v-for="operation in operationData" :value="operation.operation_id"
                                    :selected="operation.operation_id == selectedOperation">{{ operation.display_name }}
                                </option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th><label for="asset-process-time-input"># of Processing Times:</label></th>
                        <td><input type="number" id="asset-process-time-input" name="asset-process-time-input" min="1"
                                step="1" :value="processingTimes.length" @change="handleNumberOfProcessTimesChange"
                                class="small-number-input" /></td>
                    </tr>
                    <tr>
                        <th>Processing Time(s) in Minutes:</th>
                        <td><input v-for="(processingTime, index) in processingTimes" type="number" min="0"
                                :value="processingTime" :id="'asset-process-time-input-' + index"
                                :name="'asset-process-time-input-' + index" class="small-number-input"
                                @change="handleProcessTimesChange($event, index)" /></td>
                    </tr>
                    <tr v-if="fromRoutes">
                        <th>Routing From:</th>
                        <td>
                            <VueMultiselect v-model="selectedFromRoutes" :options="fromRoutes" :multiple="true"
                                :close-on-select="false" placeholder="Select at least one job">
                                <template slot="selection" slot-scope="{ values, search, isOpen }"><span
                                        class="multiselect__single" v-if="values.length" v-show="!isOpen">{{ values.length
                                        }} options selected</span></template>
                            </VueMultiselect>
                        </td>
                    </tr>
                    <tr v-if="fromRoutes && selectedFromRoutes && selectedFromRoutes.length">
                        <th>Routing From Time(s) in Minutes:</th>
                        <td><input v-for="(selection, index) in selectedFromRoutes" value="0" min="0" type="number"
                                :id="'asset-routing-from-time-input-' + index"
                                :name="'asset-routing-from-time-input-' + index" class="small-number-input" />
                        </td>
                    </tr>
                    <tr v-if="toRoutes">
                        <th>Routing To:</th>
                        <td>
                            <VueMultiselect v-model="selectedToRoutes" :options="toRoutes" :multiple="true"
                                :close-on-select="false" placeholder="Select at least one job">
                                <template slot="selection" slot-scope="{ values, search, isOpen }"><span
                                        class="multiselect__single" v-if="values.length" v-show="!isOpen">{{ values.length
                                        }} options selected</span></template>
                            </VueMultiselect>
                        </td>
                    </tr>
                    <tr v-if="toRoutes && selectedToRoutes && selectedToRoutes.length">
                        <th>Routing To Time(s) in Minutes:</th>
                        <td><input v-for="(selection, index) in selectedToRoutes" value="0" min="0" type="number"
                                :id="'asset-routing-to-time-input-' + index" :name="'asset-routing-to-time-input-' + index"
                                class="small-number-input" /></td>
                    </tr>
                </table>
                <button>Add Asset</button>
            </form>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import titleMixin from '../mixins/titleMixin';
import Sidebar from '@/components/Sidebar.vue';
import dataRequest from '@/utils/dataRequest';
import VueMultiselect from 'vue-multiselect';
import LoadingModal from '@/components/LoadingModal.vue';
export default {
    data() {
        return {
            loading: false,
            assetData: null,
            operationData: null,
            operationToLocationData: null,
            taskSequenceData: null,
            experimentID: 2,
            selectedOperation: null,
            fromRoutes: null,
            selectedFromRoutes: null,
            toRoutes: null,
            selectedToRoutes: null,
            processingTimes: [1]
        }
    },
    mixins: [titleMixin],
    title: 'Experiment Designer',
    components: { Sidebar, Header, VueMultiselect, LoadingModal },
    methods: {
        async getAssetData() {
            let data = await dataRequest("/api/experiment/asset/" + this.experimentID, "GET");
            // console.log(data);
            this.assetData = data.map(e => e.asset);
        },
        async getTaskSequenceData() {
            let data = await dataRequest("/api/experiment/task-sequence/" + this.experimentID, "GET");
            // console.log(data);
            this.taskSequenceData = data.map(e => e.task_sequence);
            this.operationData = data.map(e => e.task_sequence.operation);
            this.handleOperationChange({ target: { value: data[0].task_sequence.operation.operation_id } });
            console.log(this.taskSequenceData);
            console.log(this.operationData);
        },
        async getOperationToLocationData() {
            let data = await dataRequest("/api/experiment/operation-to-location/" + this.experimentID, "GET");
            console.log(data);
            this.operationToLocationData = data.map(e => e.operation_to_location);
        },
        async getData() {
            await this.getOperationToLocationData()
            await Promise.allSettled([
                this.getAssetData(),
                this.getTaskSequenceData(),
            ])
        },
        async handleAddAsset(e) {
            let fromList;
            let toList;
            if (this.selectedFromRoutes) {
                fromList = this.assetData.filter(e => this.selectedFromRoutes.indexOf(e.display_name) !== -1).map(e => e.asset_id);
            } else {
                fromList = ""
            }
            let fromTime = Array.from(document.querySelectorAll("[id^='asset-routing-from-time-input-']")).map(e => e.value);
            if (this.selectedToRoutes) {
                toList = this.assetData.filter(e => this.selectedToRoutes.indexOf(e.display_name) !== -1).map(e => e.asset_id);
            } else {
                toList = ""
            }
            let toTime = Array.from(document.querySelectorAll("[id^='asset-routing-to-time-input-']")).map(e => e.value);
            let body = {
                aname: document.getElementById("asset-name-input").value,
                atype: document.getElementById("asset-type-select").value,
                x: document.getElementById("asset-xpos-input").value,
                y: document.getElementById("asset-ypos-input").value,
                z: document.getElementById("asset-zpos-input").value,
                l: document.getElementById("asset-length-input").value,
                w: document.getElementById("asset-width-input").value,
                h: document.getElementById("asset-height-input").value,
                capacity: document.getElementById("asset-capacity-input").value,
                op_id: document.getElementById("asset-operation-select").value,
                proc_time: this.processingTimes.toString(),
                fromList: fromList.toString(),
                fromTime: fromTime.toString(),
                toList: toList.toString(),
                toTime: toTime.toString()
            }
            console.log(body);
            let validated = true;
            if (!body.aname || body.aname.length == 0) {
                validated = false;
            }
            if (this.assetData.find(e => e.display_name == body.aname)) {
                validated = false;
            }
            if (this.toRoutes && this.toRoutes.length > 0 && (!this.selectedToRoutes || this.selectedToRoutes.length == 0)) {
                validated = false;
            }
            if (this.fromRoutes && this.fromRoutes.length > 0 && (!this.selectedFromRoutes || this.selectedFromRoutes.length == 0)) {
                validated = false;
            }
            if (validated) {
                this.loading = true;
                let { status } = await dataRequest("/api/asset/create-default", "POST", JSON.stringify(body), { statusOnly: true });
                this.loading = false;
                if (status == 200) {
                    window.alert("Asset Added Successfully!");
                } else {
                    window.alert("Something went wrong. Check your connection. If you have internet, contact your admin the database may have been corrupted by this failure.");
                }
            } else {
                window.alert('Incorrect Inputs. Asset must have a unique name and at least one "From Route" and one "To Route" must be selected.')
            }
        },
        handleOperationChange(e) {
            this.selectedOperation = e.target.value;
            let toOperationEntry = this.taskSequenceData.find(e => e.operation_id == this.selectedOperation);
            if (toOperationEntry && toOperationEntry.next_operation) {
                this.toRoutes = this.operationToLocationData.filter(e => e.operation_id == toOperationEntry.next_operation).map(e => e.asset.display_name);
            } else {
                this.toRoutes = null;
            }
            let fromOperationEntry = this.taskSequenceData.find(e => e.next_operation == this.selectedOperation);
            if (fromOperationEntry) {
                this.fromRoutes = this.operationToLocationData.filter(e => e.operation_id == fromOperationEntry.operation_id).map(e => e.asset.display_name);
            } else {
                this.fromRoutes = null;
            }
            this.selectedFromRoutes = null;
            this.selectedToRoutes = null;
            console.log(this.toRoutes);
            console.log(this.fromRoutes);
        },
        handleNumberOfProcessTimesChange(e) {
            if (e.target.value > this.processingTimes.length) {
                let iterations = e.target.value - this.processingTimes.length
                for (let i = 0; i < iterations; i++) {
                    this.processingTimes.push(1);
                }
            } else {
                this.processingTimes = this.processingTimes.splice(0, e.target.value)
            }
        },
        handleProcessTimesChange(e, index) {
            this.processingTimes[index] = parseInt(e.target.value);
        }
    },
    mounted() {
        this.getData();
    },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style>.small-number-input {
    /* border: none; */
    margin: 4px;
    width: 50px;
}</style>