<template>
    <LoadingModal :display="loading" :estimatedLoadingTime="5000" />
    <Header />
    <div class="site-container">
        <Sidebar />
        <AdminSidebar />
        <div class="content">
            <h1>Equipment Management</h1>
            <h2>Add Asset</h2>
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
                        <td><input step="0.001" type="number" id="asset-xpos-input" name="asset-xpos-input" value="0"
                                class="small-number-input" /></td>
                    </tr>
                    <tr>
                        <th><label for="asset-ypos-input">Y Position (Feet):</label></th>
                        <td><input step="0.001" type="number" id="asset-ypos-input" name="asset-ypos-input" value="0"
                                class="small-number-input" /></td>
                    </tr>
                    <tr>
                        <th><label for="asset-zpos-input">Z Position (Feet):</label></th>
                        <td><input step="0.001" type="number" id="asset-zpos-input" name="asset-zpos-input" value="0"
                                class="small-number-input" /></td>
                    </tr>
                    <tr>
                        <th><label for="asset-width-input">Width (Feet):</label></th>
                        <td><input step="0.001" type="number" min="0" id="asset-width-input" name="asset-width-input"
                                value="5" class="small-number-input" /></td>
                    </tr>
                    <tr>
                        <th><label for="asset-length-input">Length (Feet):</label></th>
                        <td><input step="0.001" type="number" min="0" id="asset-length-input" name="asset-length-input"
                                value="5" class="small-number-input" /></td>
                    </tr>
                    <tr>
                        <th><label for="asset-height-input">Height (Feet):</label></th>
                        <td><input step="0.001" type="number" min="0" id="asset-height-input" name="asset-height-input"
                                value="5" class="small-number-input" /></td>
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
                            <select id="asset-operation-select" name="asset-type-select"
                                @change="handleOperationChange">
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
                                        class="multiselect__single" v-if="values.length" v-show="!isOpen">{{
                                            values.length
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
                                        class="multiselect__single" v-if="values.length" v-show="!isOpen">{{
                                            values.length
                                        }} options selected</span></template>
                            </VueMultiselect>
                        </td>
                    </tr>
                    <tr v-if="toRoutes && selectedToRoutes && selectedToRoutes.length">
                        <th>Routing To Time(s) in Minutes:</th>
                        <td><input v-for="(selection, index) in selectedToRoutes" value="0" min="0" type="number"
                                :id="'asset-routing-to-time-input-' + index"
                                :name="'asset-routing-to-time-input-' + index" class="small-number-input" /></td>
                    </tr>
                </table>
                <button>Add Asset</button>
            </form>
            <br />
            <div>
                <h2>Edit Asset</h2>
                <select @change="handleEditSelectionChange($event)">
                    <option v-for="asset in assetData" :value="asset.asset_id"
                        :selected="this.selectedToDelete == asset.asset_id">
                        {{ asset.display_name }}</option>
                </select>
                <form @submit.prevent="handleEditAsset">
                    <table class="grid-less">
                        <tr>
                            <th><label for="edit-asset-name-input">Name:</label></th>
                            <td><input type="text" id="edit-asset-name-input" name="edit-asset-name-input"
                                    :value="this.editAssetValues.aname"
                                    @change="e => this.editAssetValues.aname = e.target.value" /></td>
                        </tr>
                        <tr>
                            <th><label for="edit-asset-type-select">Asset Type:</label></th>
                            <td>
                                <select id="edit-asset-type-select" name="edit-asset-type-select"
                                    @change="e => this.editAssetValues.atype = e.target.value">
                                    <option value="EQUIPMENT_MACHINE"
                                        :selected="this.editAssetValues.atype == 'EQUIPMENT_MACHINE'">
                                        Equipment/Machine</option>
                                    <option value="STORAGE_AREA"
                                        :selected="this.editAssetValues.atype == 'STORAGE_AREA'">Storage
                                        Area</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="edit-asset-xpos-input">X Position (Feet):</label></th>
                            <td><input step="0.001" type="number" id="edit-asset-xpos-input"
                                    name="edit-asset-xpos-input" class="small-number-input"
                                    :value="this.editAssetValues.x"
                                    @change="e => this.editAssetValues.x = e.target.value" /></td>
                        </tr>
                        <tr>
                            <th><label for="edit-asset-ypos-input">Y Position (Feet):</label></th>
                            <td><input step="0.001" type="number" id="edit-asset-ypos-input"
                                    name="edit-asset-ypos-input" class="small-number-input"
                                    :value="this.editAssetValues.y"
                                    @change="e => this.editAssetValues.y = e.target.value" /></td>
                        </tr>
                        <tr>
                            <th><label for="edit-asset-zpos-input">Z Position (Feet):</label></th>
                            <td><input step="0.001" type="number" id="edit-asset-zpos-input"
                                    name="edit-asset-zpos-input" class="small-number-input"
                                    :value="this.editAssetValues.z"
                                    @change="e => this.editAssetValues.z = e.target.value" /></td>
                        </tr>
                        <tr>
                            <th><label for="edit-asset-width-input">Width (Feet):</label></th>
                            <td><input step="0.001" type="number" min="0" id="edit-asset-width-input"
                                    name="edit-asset-width-input" :value="this.editAssetValues.w"
                                    class="small-number-input" @change="e => this.editAssetValues.w = e.target.value" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="edit-asset-length-input">Length (Feet):</label></th>
                            <td><input step="0.001" type="number" min="0" id="edit-asset-length-input"
                                    name="edit-asset-length-input" :value="this.editAssetValues.l"
                                    class="small-number-input" @change="e => this.editAssetValues.l = e.target.value" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="edit-asset-height-input">Height (Feet):</label></th>
                            <td><input step="0.001" type="number" min="0" id="edit-asset-height-input"
                                    name="edit-asset-height-input" :value="this.editAssetValues.h"
                                    class="small-number-input" @change="e => this.editAssetValues.h = e.target.value" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="edit-asset-capacity-input">Capacity:</label></th>
                            <td><input type="number" min="0" step="1" id="edit-asset-capacity-input"
                                    @change="e => this.editAssetValues.capacity = e.target.value"
                                    name="edit-asset-capacity-input" :value="this.editAssetValues.capacity"
                                    class="small-number-input" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="edit-asset-operation-select">Associated Operation:</label></th>
                            <td>
                                <select id="edit-asset-operation-select" name="edit-asset-type-select"
                                    @change="handleEditOperationChange">
                                    <option v-for="operation in operationData" :value="operation.operation_id"
                                        :selected="operation.operation_id == this.editAssetValues.op_id">{{
                                            operation.display_name }}
                                    </option>
                                </select>
                            </td>
                        </tr>
                        <tr v-if="editFromRoutes">
                            <th>Routing From:</th>
                            <td>
                                <VueMultiselect v-model="selectedEditFromRoutes" :options="editFromRoutes"
                                    :multiple="true" :close-on-select="false" placeholder="Select at least one job">
                                    <template slot="selection" slot-scope="{ values, search, isOpen }"><span
                                            class="multiselect__single" v-if="values.length" v-show="!isOpen">{{
                                                values.length
                                            }} options selected</span></template>
                                </VueMultiselect>
                            </td>
                        </tr>
                        <tr v-if="editFromRoutes && selectedEditFromRoutes && selectedEditFromRoutes.length">
                            <th>Routing From Time(s) in Minutes:</th>
                            <td><input v-for="(selection, index) in selectedEditFromRoutes" value="0" min="0"
                                    type="number" :id="'asset-routing-from-time-input-' + index"
                                    :name="'asset-routing-from-time-input-' + index" class="small-number-input" />
                            </td>
                        </tr>
                        <tr v-if="editToRoutes">
                            <th>Routing To:</th>
                            <td>
                                <VueMultiselect v-model="selectedEditToRoutes" :options="editToRoutes" :multiple="true"
                                    :close-on-select="false" placeholder="Select at least one job">
                                    <template slot="selection" slot-scope="{ values, search, isOpen }"><span
                                            class="multiselect__single" v-if="values.length" v-show="!isOpen">{{
                                                values.length
                                            }} options selected</span></template>
                                </VueMultiselect>
                            </td>
                        </tr>
                        <tr v-if="editToRoutes && selectedEditToRoutes && selectedEditToRoutes.length">
                            <th>Routing To Time(s) in Minutes:</th>
                            <td><input v-for="(selection, index) in selectedEditToRoutes" value="0" min="0"
                                    type="number" :id="'asset-routing-to-time-input-' + index"
                                    :name="'asset-routing-to-time-input-' + index" class="small-number-input" /></td>
                        </tr>
                    </table>
                    <button>Save Asset Changes</button>
                </form>
            </div>
            <br />
            <div>
                <h2>Delete Asset</h2>
                <select @change="e => this.selectedToDelete = e.target.value">
                    <option v-for="asset in assetData" :value="asset.asset_id"
                        :selected="this.selectedToDelete == asset.asset_id">
                        {{ asset.display_name }}</option>
                </select>
                <button @click="handleDeleteAsset">Delete</button>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import titleMixin from '../mixins/titleMixin';
import Sidebar from '@/components/Sidebar.vue';
import AdminSidebar from '@/components/AdminSidebar.vue';
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
            processTimeData: null,
            experimentID: 2,
            selectedOperation: null,
            fromRoutes: null,
            selectedFromRoutes: null,
            toRoutes: null,
            selectedToRoutes: null,
            editFromRoutes: null,
            selectedEditFromRoutes: null,
            editToRoutes: null,
            selectedEditToRoutes: null,
            processingTimes: [1],
            selectedToDelete: null,
            selectedToEdit: null,
            editAssetValues: {
                aname: null,
                atype: null,
                x: null,
                y: null,
                z: null,
                l: null,
                w: null,
                h: null,
                capacity: null,
                op_id: null,
                fromList: null,
                fromTime: null,
                toList: null,
                toTime: null
            }
        }
    },
    mixins: [titleMixin],
    title: 'Experiment Designer',
    components: { AdminSidebar, Sidebar, Header, VueMultiselect, LoadingModal },
    methods: {
        async getAssetData() {
            let data = await dataRequest("/api/experiment/asset/" + this.experimentID, "GET");
            // console.log(data);
            this.assetData = data.map(e => e.asset);
            // console.log(this.assetData);
            this.selectedToDelete = this.assetData[0].asset_id;
            this.handleEditSelectionChange({ target: { value: this.assetData[0].asset_id } });
        },
        async getTaskSequenceData() {
            let data = await dataRequest("/api/experiment/task-sequence/" + this.experimentID, "GET");
            // console.log(data);
            this.taskSequenceData = data.map(e => e.task_sequence);
            this.operationData = data.map(e => e.task_sequence.operation);
            this.handleOperationChange({ target: { value: data[0].task_sequence.operation.operation_id } });
            // console.log(this.taskSequenceData);
            // console.log(this.operationData);
        },
        async getOperationToLocationData() {
            let data = await dataRequest("/api/experiment/operation-to-location/" + this.experimentID, "GET");
            // console.log(data);
            this.operationToLocationData = data.map(e => e.operation_to_location);
        },
        async getData() {
            await this.getOperationToLocationData();
            await this.getTaskSequenceData();
            await this.getAssetData();
            // await Promise.allSettled([
            //     this.getAssetData(),
            //     this.getTaskSequenceData(),
            // ])
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
            // console.log(body);
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
                    window.location.reload();
                } else {
                    window.alert("Something went wrong. Check your connection. If you have internet, contact your admin the database may have been corrupted by this failure.");
                }
            } else {
                window.alert('Incorrect Inputs. Asset must have a unique name and at least one "From Route" and one "To Route" must be selected.')
            }
        },
        async handleEditAsset(e) {
            let fromList;
            let toList;
            if (this.selectedEditFromRoutes) {
                fromList = this.assetData.filter(e => this.selectedEditFromRoutes.indexOf(e.display_name) !== -1).map(e => e.asset_id);
            } else {
                fromList = ""
            }
            let fromTime = Array.from(document.querySelectorAll("[id^='edit-asset-routing-from-time-input-']")).map(e => e.value);
            if (this.selectedEditToRoutes) {
                toList = this.assetData.filter(e => this.selectedEditToRoutes.indexOf(e.display_name) !== -1).map(e => e.asset_id);
            } else {
                toList = ""
            }
            let toTime = Array.from(document.querySelectorAll("[id^='edit-asset-routing-to-time-input-']")).map(e => e.value);
            let body = {
                display_name: document.getElementById("edit-asset-name-input").value,
                asset_type: document.getElementById("edit-asset-type-select").value,
                pos_x: document.getElementById("edit-asset-xpos-input").value,
                pos_y: document.getElementById("edit-asset-ypos-input").value,
                pos_z: document.getElementById("edit-asset-zpos-input").value,
                dim_length_feet: document.getElementById("edit-asset-length-input").value,
                dim_width_feet: document.getElementById("edit-asset-width-input").value,
                dim_height_feet: document.getElementById("edit-asset-height-input").value,
                capacity: document.getElementById("edit-asset-capacity-input").value,
                // op_id: document.getElementById("edit-asset-operation-select").value,
                // fromList: fromList.toString(),
                // fromTime: fromTime.toString(),
                // toList: toList.toString(),
                // toTime: toTime.toString()
            }
            let origins = [];
            let destinations = [];
            this.selectedEditFromRoutes.forEach(entry => origins.push(this.assetData.find(f => f.display_name == entry).asset_id))
            this.selectedEditToRoutes.forEach(entry => destinations.push(this.assetData.find(f => f.display_name == entry).asset_id))
            console.log(body);
            console.log(this.origins);
            console.log(this.destinations);
            let validated = true;
            if (!body.display_name || body.display_name.length == 0) {
                console.log('asset name exists')
                validated = false;
            }
            if (this.assetData.find(e => e.display_name == body.display_name && e.asset_id !== this.selectedToEdit)) {
                console.log('asset name duplication')
                validated = false;
            }
            if (this.editToRoutes && this.editToRoutes.length > 0 && (!this.selectedEditToRoutes || this.selectedEditToRoutes.length == 0)) {
                console.log('to');
                validated = false;
            }
            if (this.editFromRoutes && this.editFromRoutes.length > 0 && (!this.selectedEditFromRoutes || this.selectedEditFromRoutes.length == 0)) {
                console.log('from');
                validated = false;
            }
            if (validated) {
                this.loading = true;
                let assetResponse = await dataRequest("/api/asset/" + this.selectedToEdit, "PUT", JSON.stringify(body), { statusOnly: true });
                let routingFromResponse = { status: 200 };
                let routingToResponse = { status: 200 };
                if (origins.length > 0) {
                    let routingFromResponse = await dataRequest("/api/routing/asset/from/" + this.selectedToEdit, "PUT", JSON.stringify(this.origins), { statusOnly: true });
                }
                if (destinations.length > 0) {
                    let routingToResponse = await dataRequest("/api/routing/asset/to/" + this.selectedToEdit, "PUT", JSON.stringify(this.destinations), { statusOnly: true });
                }
                this.loading = false;
                if (assetResponse.status == 200 && routingFromResponse.status == 200 && routingToResponse.status == 200) {
                    window.alert("Asset Saved Successfully!");
                    window.location.reload();
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
            // console.log(this.toRoutes);
            // console.log(this.fromRoutes);
        },
        handleEditOperationChange(e) {
            this.editAssetValues.op_id = e.target.value;
            let toOperationEntry = this.taskSequenceData.find(e => e.operation_id == this.editAssetValues.op_id);
            if (toOperationEntry && toOperationEntry.next_operation) {
                this.editToRoutes = this.operationToLocationData.filter(e => e.operation_id == toOperationEntry.next_operation).map(e => e.asset.display_name);
            } else {
                this.editToRoutes = null;
            }
            let fromOperationEntry = this.taskSequenceData.find(e => e.next_operation == this.editAssetValues.op_id);
            if (fromOperationEntry) {
                this.editFromRoutes = this.operationToLocationData.filter(e => e.operation_id == fromOperationEntry.operation_id).map(e => e.asset.display_name);
            } else {
                this.editFromRoutes = null;
            }
            this.selectedEditFromRoutes = null;
            this.selectedEditToRoutes = null;
            // console.log(this.editToRoutes);
            // console.log(this.editFromRoutes);
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
        },
        handleEditSelectionChange(e) {
            this.selectedToEdit = e.target.value;
            let asset = this.assetData.find(f => e.target.value == f.asset_id);
            let operation = this.operationToLocationData.find(f => e.target.value == f.asset_id);
            // console.log(operation);
            this.editAssetValues.aname = asset.display_name;
            this.editAssetValues.atype = asset.asset_type;
            this.editAssetValues.x = asset.pos_x;
            this.editAssetValues.y = asset.pos_y;
            this.editAssetValues.z = asset.pos_z;
            this.editAssetValues.l = asset.dim_length_feet;
            this.editAssetValues.w = asset.dim_width_feet;
            this.editAssetValues.h = asset.dim_height_feet;
            this.editAssetValues.capacity = asset.capacity;
            this.editAssetValues.op_id = operation.operation_id;
            this.handleEditOperationChange({ target: { value: operation.operation_id } });
            // this.editAssetValues.fromList = ;
            // this.editAssetValues.fromTime = ;
            // this.editAssetValues.toList = ;
            // this.editAssetValues.toTime = ;
        },
        async handleDeleteAsset() {
            let { status } = await dataRequest('/api/asset/' + this.selectedToDelete, "DELETE", { statusOnly: true });
            if (status == 200) {
                window.alert("Asset Deleted Successfully")
                window.location.reload();
            } else {
                window.alert("Something went wrong when deleting asset.")
            }
        }
    },
    mounted() {
        this.getData();
    },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style>
.small-number-input {
    /* border: none; */
    margin: 4px;
    width: 50px;
}
</style>