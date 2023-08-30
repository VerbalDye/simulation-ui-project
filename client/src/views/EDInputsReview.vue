<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <ExperimentDesignerSidebar currentPage="2" />
        <div class="content">
            <h1>3. Inputs Definition & Review</h1>
            <div id="input-collapsables">
                <div class="flex-between collapsable-header">
                    <h2>Site Selection</h2>
                    <button class="collapse-button" @click="handleCollapse('site-selection', $event)"><i
                            class="bi bi-dash-circle-fill"></i></button>
                </div>
                <div id="site-selection" class="collapsable open">
                    <form
                        @change="this.selectedSite = document.querySelector(`input[name='site-selection']:checked`).value">
                        <label v-for="site in siteData" :for="site.site_id" class="radio-container">
                            <input :id="site.site_id" type="radio" name="site-selection" class="checkbox"
                                :value="site.site_id">
                            <span class="radio-checkmark"></span>
                            {{ site.site_name }}
                        </label>
                    </form>
                    <div class="flex-right">
                        <button @click="goToCollapsable('phases-cells-operations')">Next</button>
                    </div>
                </div>
                <div class="flex-between collapsable-header">
                    <h2>Production Process</h2>
                    <button class="collapse-button" @click="handleCollapse('production-process-settings', $event)"><i
                            class="bi bi-plus-circle-fill"></i></button>
                </div>
                <div id="production-process-settings" class="collapsable">
                    <div class="flex-between collapsable-header">
                        <h3>Phases, Cells, & Operations</h3>
                        <button class="collapse-button" @click="handleCollapse('phases-cells-operations', $event)"><i
                                class="bi bi-plus-circle-fill"></i></button>
                    </div>
                    <div id="phases-cells-operations" class="collapsable">
                        <div>
                            <div v-for="(task, index) in formattedTaskSequenceData" class="drop-zone"
                                @drop="onDrop($event, index)" @dragover.prevent @dragenter.prevent>
                                <div v-if="task.type == 'phase'" class="phase" draggable="true"
                                    @dragstart="startDrag($event, task)">
                                    {{ task.displayName }}
                                </div>
                                <div v-else-if="task.type == 'operation'" class="operation" draggable="true"
                                    @dragstart="startDrag($event, task)">
                                    {{ task.displayName }}
                                </div>
                                <div v-else-if="task.type == 'cell'" class="cell" draggable="true"
                                    @dragstart="startDrag($event, task)">
                                    {{ task.displayName }}
                                </div>
                            </div>
                        </div>
                        <div class="flex-right">
                            <button @click="goToCollapsable('site-selection')">Back</button>
                            <button @click="goToCollapsable('locations-processing-times')">Next</button>
                        </div>
                    </div>
                    <div class="flex-between collapsable-header">
                        <h3>Locations & Processing Times</h3>
                        <button class="collapse-button" @click="handleCollapse('locations-processing-times', $event)"><i
                                class="bi bi-plus-circle-fill"></i></button>
                    </div>
                    <div id="locations-processing-times" class="collapsable">
                        <div class="flex-between align-top">
                            <div class="flex-vertical">
                                <div class="card">
                                    <h4 class="card-title">Phases, Cells, & Operations</h4>
                                    <div class="view-window">
                                        <div v-for="(task, index) in formattedTaskSequenceData" class="drop-zone">
                                            <div v-if="task.type == 'phase'">
                                                <div class="phase selected-operation"
                                                    v-if="this.taskSequenceData[this.selectedOperation].task_sequence.phase.phase_id == task.id">
                                                    {{ task.displayName }}
                                                </div>
                                                <div v-else class="phase">
                                                    {{ task.displayName }}
                                                </div>
                                            </div>
                                            <div v-else-if="task.type == 'cell'">
                                                <div class="cell selected-operation"
                                                    v-if="this.taskSequenceData[this.selectedOperation].task_sequence.cell.cell_id == task.id">
                                                    {{ task.displayName }}
                                                </div>
                                                <div v-else class="cell">
                                                    {{ task.displayName }}
                                                </div>
                                            </div>
                                            <div v-else-if="task.type == 'operation'">
                                                <div class="operation selected-operation"
                                                    v-if="this.taskSequenceData[this.selectedOperation].task_sequence.operation.operation_id == task.id">
                                                    {{ task.displayName }}
                                                </div>
                                                <div v-else class="operation">
                                                    {{ task.displayName }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="this.assetData && this.taskSequenceData" class="card">
                                    <h4 class="card-title">Plant Layout</h4>
                                    <LayoutMaker mode="operation-map" :assetData="assetData"
                                        :selectedOperation="taskSequenceData[selectedOperation]"
                                        @selection-change="operationMapSelectionChange" id="1" />
                                </div>
                            </div>
                            <div class="grow-item">
                                <div class="flex-right">
                                    <button @click="clickPreviousOperation"><i class="bi bi-arrow-left"></i></button>
                                    <button @click="clickNextOperation"><i class="bi bi-arrow-right"></i></button>
                                </div>
                                <div class="card">
                                    <h4 class="card-title">Location Data</h4>
                                    <table v-if="taskSequenceData" class="grid-less">
                                        <tr>
                                            <th>Phase:</th>
                                            <td>{{
                                                this.taskSequenceData[this.selectedOperation].task_sequence.phase.display_name
                                            }}</td>
                                        </tr>
                                        <tr>
                                            <th>Cell:</th>
                                            <td>{{
                                                this.taskSequenceData[this.selectedOperation].task_sequence.cell.display_name
                                            }}</td>
                                        </tr>
                                        <tr>
                                            <th>Operation:</th>
                                            <td>{{
                                                this.taskSequenceData[this.selectedOperation].task_sequence.operation.display_name
                                            }}</td>
                                        </tr>
                                    </table>
                                    <p>Location(s):</p>
                                    <SmartTable :jsonData="selectedAssets" :advancedSearchEnabled="false"
                                        :excludedColumns="['destinations']" :id="1"/>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <h4 class="card-title">Processing Times</h4>
                            <div class="flex-between">
                                <div>
                                    <table class="grid-less">
                                        <tr>
                                            <th>Use Default?*</th>
                                            <td>
                                                <label class="switch">
                                                    <input type="checkbox" checked
                                                        @input="e => this.processTimeSettings.default = e.target.checked">
                                                    <span class="slider round"></span>
                                                </label>
                                            </td>
                                        </tr>
                                        <tr v-if="!processTimeSettings.default">
                                            <th>Apply to all?*</th>
                                            <td>
                                                <label class="switch">
                                                    <input type="checkbox"
                                                        @input="e => this.processTimeSettings.applyToAll = e.target.checked"
                                                        checked>
                                                    <span class="slider round"></span>
                                                </label>
                                            </td>
                                        </tr>
                                    </table>
                                    <p v-if="!processTimeSettings.default">Assign specific values (discrete) or use
                                        range/distribution (continuous)?*</p>
                                    <div v-if="!processTimeSettings.default">
                                        <label for="discrete-select" class="radio-container">
                                            <input id="discrete-select" type="radio" name="discrete-continuous"
                                                class="checkbox" checked
                                                @input="e => this.processTimeSettings.discrete = true">
                                            <span class="radio-checkmark"></span>
                                            Discrete
                                        </label>
                                        <label for="continuous-select" class="radio-container">
                                            <input id="continuous-select" type="radio" name="discrete-continuous"
                                                class="checkbox" @input="e => this.processTimeSettings.discrete = false">
                                            <span class="radio-checkmark"></span>
                                            Continuous
                                        </label>
                                    </div>
                                    <div v-if="!processTimeSettings.default">
                                        <div v-if="processTimeSettings.discrete">
                                            <div v-if="processTimeSettings.applyToAll">
                                                <div>
                                                    <p v-for="asset in selectedAssets">{{ asset.display_name }}</p>
                                                    <table class="grid-less">
                                                        <tr>
                                                            <th><i class="bi bi-hash"></i> Number of Samples*</th>
                                                            <td>
                                                                <input type="number"
                                                                    :value="processTimeSettings.elements[0].values.length"
                                                                    class="process-time-input"
                                                                    @input="handleNumberOfSamplesChange" :data-index="0">
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th><i class="bi bi-clock-fill"></i> Enter Processing Times
                                                                (minutes)*</th>
                                                            <td>
                                                                <div class="flex-left">
                                                                    <input
                                                                        v-for="value in this.processTimeSettings.elements[0].values"
                                                                        class="process-time-input" type="number" step="0.01"
                                                                        :value="value">
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </div>
                                            <div v-else>
                                                <div v-for="(element, index) in processTimeSettings.elements">
                                                    <p>{{ element.names[0] }}</p>
                                                    <table class="grid-less">
                                                        <tr>
                                                            <th><i class="bi bi-hash"></i> Number of Samples*</th>
                                                            <td>
                                                                <input type="number" :value="element.values.length"
                                                                    class="process-time-input"
                                                                    @input="handleNumberOfSamplesChange"
                                                                    :data-index="index">
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th><i class="bi bi-clock-fill"></i> Enter Processing Times
                                                                (minutes)*</th>
                                                            <td>
                                                                <div class="flex-left">
                                                                    <input v-for="value in element.values"
                                                                        class="process-time-input" type="number" step="0.01"
                                                                        :value="value">
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else>
                                            TBD
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    DEFAULT GRAPH
                                </div>
                            </div>
                        </div>
                        <div class="flex-right">
                            <button @click="goToCollapsable('phases-cells-operations')">Back</button>
                            <button @click="goToCollapsable('availability-buildings')">Next</button>
                        </div>
                    </div>
                </div>
                <div class="flex-between collapsable-header">
                    <h2>Resources</h2>
                    <button class="collapse-button" @click="handleCollapse('resource-assignment', $event)"><i
                            class="bi bi-plus-circle-fill"></i></button>
                </div>
                <div id="resource-assignment" class="collapsable">
                    <div class="flex-between collapsable-header">
                        <h2>Buildings</h2>
                        <button class="collapse-button" @click="handleCollapse('availability-buildings', $event)"><i
                                class="bi bi-plus-circle-fill"></i></button>
                    </div>
                    <div id="availability-buildings" class="collapsable">
                        <div class="flex-between">
                            <div class="flex-between">
                                <i class="bi bi-building-fill-gear large-icon"></i>
                                <div v-if="this.siteData && this.experimentData">
                                    <h4 class="uppercase">{{ this.siteData.find(e => e.site_id ===
                                        this.selectedSite).site_name }}</h4>
                                    <p>{{ this.siteData.find(e => e.site_id === this.selectedSite).address }}</p>
                                    <p>{{ this.siteData.find(e => e.site_id === this.selectedSite).city + ", " +
                                        siteData.find(e => e.site_id === this.selectedSite).state + " " + siteData.find(e =>
                                            e.site_id === this.selectedSite).zip }}</p>
                                </div>
                            </div>
                            <div class="card">
                                <h4 class="card-title">Hours of Operation</h4>
                                <table class="grid-less">
                                    <tr>
                                        <th>Use Default?*</th>
                                        <td>
                                            <label class="switch">
                                                <input type="checkbox">
                                                <span class="slider round"></span>
                                            </label>
                                        </td>
                                    </tr>
                                </table>
                                <table v-if="hoursOfOperationData" class="full-table">
                                    <thead>
                                        <th>Day</th>
                                        <th>Open</th>
                                        <th>Close</th>
                                        <th>Hours</th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="day in hoursOfOperationData">
                                            <td v-if="day.hours_of_operation.day_num">{{ day.hours_of_operation.day_num }}
                                            </td>
                                            <td v-else>-</td>
                                            <td v-if="day.hours_of_operation.start_time">{{
                                                day.hours_of_operation.start_time }}</td>
                                            <td v-else>-</td>
                                            <td v-if="day.hours_of_operation.end_time">{{ day.hours_of_operation.end_time }}
                                            </td>
                                            <td v-else>-</td>
                                            <td v-if="day.hours_of_operation.total_hours">{{
                                                day.hours_of_operation.total_hours }}</td>
                                            <td v-else>-</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="flex-right">
                            <button @click="goToCollapsable('locations-processing-times')">Back</button>
                            <button @click="goToCollapsable('availability-equipment-machines')">Next</button>
                        </div>
                    </div>
                    <div class="flex-between collapsable-header">
                        <h2>Equipment/Machines</h2>
                        <button class="collapse-button"
                            @click="handleCollapse('availability-equipment-machines', $event)"><i
                                class="bi bi-plus-circle-fill"></i></button>
                    </div>
                    <div id="availability-equipment-machines" class="collapsable">
                        TBD
                        <div class="flex-right">
                            <button @click="goToCollapsable('availability-buildings')">Back</button>
                            <button @click="goToCollapsable('assignment-cores-tools')">Next</button>
                        </div>
                    </div>
                    <div class="flex-between collapsable-header">
                        <h2>Cores & Tools</h2>
                        <button class="collapse-button" @click="handleCollapse('assignment-cores-tools', $event)"><i
                                class="bi bi-plus-circle-fill"></i></button>
                    </div>
                    <div id="assignment-cores-tools" class="collapsable">
                        TBD
                        <div class="flex-right">
                            <button @click="goToCollapsable('availability-equipment-machines')">Back</button>
                            <button @click="goToCollapsable('assignment-materials')">Next</button>
                        </div>
                    </div>
                    <div class="flex-between collapsable-header">
                        <h2>Materials</h2>
                        <button class="collapse-button" @click="handleCollapse('assignment-materials', $event)"><i
                                class="bi bi-plus-circle-fill"></i></button>
                    </div>
                    <div id="assignment-materials" class="collapsable">
                        TBD
                        <div class="flex-right">
                            <button @click="goToCollapsable('assignment-cores-tools')">Back</button>
                            <button @click="goToCollapsable('assignment-labor')">Next</button>
                        </div>
                    </div>
                    <div class="flex-between collapsable-header">
                        <h2>Labor</h2>
                        <button class="collapse-button" @click="handleCollapse('assignment-labor', $event)"><i
                                class="bi bi-plus-circle-fill"></i></button>
                    </div>
                    <div id="assignment-labor" class="collapsable">
                        TBD
                        <div class="flex-right">
                            <button @click="goToCollapsable('assignment-materials')">Back</button>
                            <button @click="goToCollapsable('routing')">Next</button>
                        </div>
                    </div>
                </div>
                <div class="flex-between collapsable-header">
                    <h2>Routing, Queuing, & Prioritization</h2>
                    <button class="collapse-button" @click="handleCollapse('routing-queuing-prioritization', $event)"><i
                            class="bi bi-plus-circle-fill"></i></button>
                </div>
                <div id="routing-queuing-prioritization" class="collapsable">
                    <div class="flex-between">
                        <div class="card">
                            <h4 class="card-title">Phases, Cells, & Operations</h4>
                            <div class="view-window">
                                <div v-for="(task, index) in formattedTaskSequenceData" class="drop-zone">
                                    <div v-if="task.type == 'phase'">
                                        <div class="phase selected-operation"
                                            v-if="this.taskSequenceData[this.selectedOperation].task_sequence.phase.phase_id == task.id">
                                            {{ task.displayName }}
                                        </div>
                                        <div v-else class="phase">
                                            {{ task.displayName }}
                                        </div>
                                    </div>
                                    <div v-else-if="task.type == 'cell'">
                                        <div class="cell selected-operation"
                                            v-if="this.taskSequenceData[this.selectedOperation].task_sequence.cell.cell_id == task.id">
                                            {{ task.displayName }}
                                        </div>
                                        <div v-else class="cell">
                                            {{ task.displayName }}
                                        </div>
                                    </div>
                                    <div v-else-if="task.type == 'operation'">
                                        <div class="operation selected-operation"
                                            v-if="this.taskSequenceData[this.selectedOperation].task_sequence.operation.operation_id == task.id">
                                            {{ task.displayName }}
                                        </div>
                                        <div v-else class="operation">
                                            {{ task.displayName }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex-right">
                            <button @click="clickPreviousOperation"><i class="bi bi-arrow-left"></i></button>
                            <button @click="clickNextOperation"><i class="bi bi-arrow-right"></i></button>
                        </div>
                        <div v-if="assetData && taskSequenceData" class="card">
                            <div class="card-title">Plant Layout</div>
                            <LayoutMaker mode="routing-map" :assetData="assetData"
                                :selectedOperation="taskSequenceData[selectedOperation]"
                                @selection-change="operationMapSelectionChange" id="2" />
                        </div>
                        <div v-if="taskSequenceData" class="card">
                            <h4>Current</h4>
                            <p>{{ this.taskSequenceData[this.selectedOperation].task_sequence.phase.display_name }} | {{
                                this.taskSequenceData[this.selectedOperation].task_sequence.cell.display_name }} | {{
        this.taskSequenceData[this.selectedOperation].task_sequence.operation.display_name }}</p>
                            <h4>Next</h4>
                            <p v-if="this.taskSequenceData[this.findNextOperation(this.selectedOperation)]">
                                {{
                                    this.taskSequenceData[this.findNextOperation(this.selectedOperation)].task_sequence.phase.display_name
                                }} | {{
    this.taskSequenceData[this.findNextOperation(this.selectedOperation)].task_sequence.cell.display_name
}} | {{
    this.taskSequenceData[this.findNextOperation(this.selectedOperation)].task_sequence.operation.display_name
}}</p>
                            <p v-else> - | - | - </p>
                            <h4>Following</h4>
                            <p v-if="this.taskSequenceData[this.findNextOperation(this.selectedOperation, 2)]">
                                {{ this.taskSequenceData[this.findNextOperation(this.selectedOperation,
                                    2)].task_sequence.phase.display_name }} | {{
        this.taskSequenceData[this.findNextOperation(this.selectedOperation,
            2)].task_sequence.cell.display_name }} | {{
            this.taskSequenceData[this.findNextOperation(this.selectedOperation,
                2)].task_sequence.operation.display_name }}</p>
                            <p v-else> - | - | - </p>
                        </div>
                    </div>
                    <div>
                        <div class="flex-between collapsable-header">
                            <h2>Routing</h2>
                            <button class="collapse-button" @click="handleCollapse('routing', $event)"><i
                                    class="bi bi-plus-circle-fill"></i></button>
                        </div>
                        <div id="routing" class="collapsable">
                            <SmartTable :jsonData="routingData" :advancedSearchEnabled="false"
                                        :excludedColumns="['destinations']" :id="2"/>
                            <!-- <div class="flex-right">
                            <button @click="goToCollapsable('assignment-materials')">Back</button>
                            <button @click="goToCollapsable('routing-queuing-prioritization')">Next</button>
                        </div> -->
                        </div>
                        <div class="flex-between collapsable-header">
                            <h2>Queuing</h2>
                            <button class="collapse-button" @click="handleCollapse('queuing', $event)"><i
                                    class="bi bi-plus-circle-fill"></i></button>
                        </div>
                        <div id="queuing" class="collapsable">
                            TBD
                            <!-- <div class="flex-right">
                            <button @click="goToCollapsable('assignment-materials')">Back</button>
                            <button @click="goToCollapsable('routing-queuing-prioritization')">Next</button>
                        </div> -->
                        </div>
                        <div class="flex-between collapsable-header">
                            <h2>Priority</h2>
                            <button class="collapse-button" @click="handleCollapse('priority', $event)"><i
                                    class="bi bi-plus-circle-fill"></i></button>
                        </div>
                        <div id="priority" class="collapsable">
                            TBD
                            <!-- <div class="flex-right">
                            <button @click="goToCollapsable('assignment-materials')">Back</button>
                            <button @click="goToCollapsable('routing-queuing-prioritization')">Next</button>
                        </div> -->
                        </div>
                    </div>
                    <div class="flex-right">
                        <button @click="goToCollapsable('assignment-labor')">Back</button>
                        <button @click="goToCollapsable('transportation')">Next</button>
                    </div>
                </div>
                <div class="flex-between collapsable-header">
                    <h2>Transportation</h2>
                    <button class="collapse-button" @click="handleCollapse('transportation', $event)"><i
                            class="bi bi-plus-circle-fill"></i></button>
                </div>
                <div id="transportation" class="collapsable">
                    TBD
                    <div class="flex-right">
                        <button @click="goToCollapsable('routing-queuing-prioritization')">Back</button>
                        <button @click="goToCollapsable('demand')">Next</button>
                    </div>
                </div>
                <div class="flex-between collapsable-header">
                    <h2>Demand</h2>
                    <button class="collapse-button" @click="handleCollapse('demand', $event)"><i
                            class="bi bi-plus-circle-fill"></i></button>
                </div>
                <div id="demand" class="collapsable">
                    TBD
                    <div class="flex-right">
                        <button @click="goToCollapsable('transportation')">Back</button>
                        <button @click="goToCollapsable('review')">Next</button>
                    </div>
                </div>
                <div class="flex-between collapsable-header">
                    <h2>Review</h2>
                    <button class="collapse-button" @click="handleCollapse('review', $event)"><i
                            class="bi bi-plus-circle-fill"></i></button>
                </div>
                <div id="review" class="collapsable">
                    TBD
                    <div class="flex-right">
                        <button @click="goToCollapsable('demand')">Back</button>
                    </div>
                </div>
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
import LayoutMaker from '@/components/LayoutMaker.vue';
import SmartTable from '@/components/SmartTable.vue';
import dataRequest from '@/utils/dataRequest';
export default {
    data() {
        return {
            experimentData: null,
            experimentID: null,
            operationToLocationData: null,
            siteData: null,
            selectedSite: null,
            taskSequenceData: null,
            formattedTaskSequenceData: null,
            assetData: null,
            routingData: null,
            selectedOperation: 0,
            selectedAssets: null,
            hoursOfOperationData: null,
            processTimeSettings: {
                default: true,
                applyToAll: true,
                discrete: true,
                elements: []
            },
            processTimeData: null
        }
    },
    mixins: [titleMixin],
    title: 'Experiment Designer',
    components: { Sidebar, Header, ExperimentDesignerSidebar, ExperimentDesignerSidebar, LayoutMaker, SmartTable },
    methods: {
        getExperimentID() {
            this.experimentID = window.location.href.split("/")[window.location.href.split("/").length - 1];
        },
        async getExperimentData() {
            let data = await dataRequest("/api/experiment/" + this.experimentID, "GET");
            this.experimentData = data;
            this.selectedSite = data.experiment_site.site_id
            return data;
        },
        async getSiteData() {
            let data = await dataRequest("/api/site", "GET");
            this.siteData = data;
            return data;
        },
        async getTaskSequenceData() {
            let data = await dataRequest("/api/experiment/task-sequence/" + this.experimentID, "GET");
            this.taskSequenceData = data;
            this.formattedTaskSequenceData = this.formatTaskSequenceData(data);
            this.selectedOperation = 0;
        },
        async getAssetData() {
            let data = await dataRequest("/api/experiment/asset/" + this.experimentID, "GET");
            console.log(data);
            this.assetData = data;
        },
        async getOperationToLocationData() {
            let data = await dataRequest("/api/experiment/operation-to-location/" + this.experimentID, "GET");
            this.operationToLocationData = data;
        },
        async getHoursOfOperationData() {
            let data = await dataRequest("/api/experiment/hours-of-operation/" + this.experimentID, "GET");
            this.hoursOfOperationData = data;
        },
        async getProcessTimeData() {
            let data = await dataRequest("/api/experiment/process-time/" + this.experimentID, "GET");
            this.processTimeData = data;
        },
        async getRoutingData() {
            let data = await dataRequest("/api/experiment/routing/" + this.experimentID, "GET");
            console.log(data);
            this.routingData = data;
        },
        async getData() {
            this.getExperimentID();
            this.getHoursOfOperationData();
            this.getOperationToLocationData();
            this.getRoutingData();
            await this.getAssetData();
            await this.getTaskSequenceData();
            await this.getProcessTimeData();
            this.selectedOperationChange();
            let experimentData = await this.getExperimentData();
            await this.getSiteData();
            this.selectedSite = experimentData.experiment_site.site_id;
            const siteSelectionEl = document.querySelector('input[value="' + experimentData.experiment_site.site_id + '"]');
            siteSelectionEl.checked = true;
        },
        async saveAllChanges() {
            await dataRequest("/api/experiment/site/" + this.experimentID, "PUT", JSON.stringify({ site_id: this.selectedSite }));
        },
        formatTaskSequenceData(data) {
            const formattedData = [];
            const completedPhases = [];
            const completedCells = [];
            let currentID = data.find(e => e.task_sequence.start == true).task_sequence_id;
            let currentPosition = 0;
            for (let i = 0; i < data.length; i++) {
                let sequenceItem = data.find(e => e.task_sequence_id == currentID).task_sequence;
                if (!completedPhases.includes(sequenceItem.phase.phase_id)) {
                    formattedData.push({
                        type: 'phase',
                        id: sequenceItem.phase.phase_id,
                        displayName: sequenceItem.phase.display_name,
                        position: currentPosition,
                        containsOperations: true
                    })
                    currentPosition++;
                    completedPhases.push(sequenceItem.phase.phase_id);
                }
                if (!completedCells.includes(sequenceItem.cell.cell_id)) {
                    formattedData.push({
                        type: 'cell',
                        id: sequenceItem.cell.cell_id,
                        displayName: sequenceItem.cell.display_name,
                        position: currentPosition,
                        containsOperations: true
                    })
                    currentPosition++;
                    completedCells.push(sequenceItem.cell.cell_id)
                }
                formattedData.push({
                    type: 'operation',
                    id: sequenceItem.operation.operation_id,
                    displayName: sequenceItem.operation.display_name,
                    position: currentPosition
                })
                currentPosition++;
                currentID = sequenceItem.next_operation
            }
            return formattedData;
        },
        findNextOperation(index, steps) {
            if (!steps) { steps = 1; }
            let nextIndex = index;
            for (let i = 0; i < steps; i++) {
                nextIndex = this.taskSequenceData.map(item => item.task_sequence.operation_id).indexOf(this.taskSequenceData[nextIndex].task_sequence.next_operation);
                if (nextIndex == -1) {
                    return nextIndex;
                }
            }
            return nextIndex;
        },
        findPreviousOperation(index, steps) {
            if (!steps) { steps = 1; }
            let nextIndex = index;
            for (let i = 0; i < steps; i++) {
                nextIndex = this.taskSequenceData.map(item => item.task_sequence.next_operation).indexOf(this.taskSequenceData[nextIndex].task_sequence.operation_id);
                if (nextIndex == -1) {
                    return nextIndex;
                }
            }
            return nextIndex;
        },
        handleCollapse(element, event) {
            let iEl = event.currentTarget.firstChild;
            const collapsableEl = document.getElementById(element);
            if (iEl.classList.contains("bi-plus-circle-fill")) {
                iEl.classList.remove("bi-plus-circle-fill");
                iEl.classList.add("bi-dash-circle-fill");
                collapsableEl.classList.add("open");
            } else {
                iEl.classList.remove("bi-dash-circle-fill");
                iEl.classList.add("bi-plus-circle-fill");
                collapsableEl.classList.remove("open");
            }
        },
        goToCollapsable(id) {
            let openCollapsables = document.querySelectorAll(".open");
            let nextTarget = document.getElementById(id);
            openCollapsables.forEach(collapsable => {
                let header = collapsable.previousSibling.children[1].firstChild
                header.classList.remove("bi-dash-circle-fill");
                header.classList.add("bi-plus-circle-fill");
                collapsable.classList.remove("open");
            });
            while (nextTarget) {
                if (nextTarget.classList.contains("collapsable")) {
                    let header = nextTarget.previousSibling.children[1].firstChild
                    nextTarget.classList.add("open");
                    header.classList.remove("bi-plus-circle-fill");
                    header.classList.add("bi-dash-circle-fill");
                }
                nextTarget = nextTarget.parentElement;
            }
            let top = document.getElementById(id).previousSibling.offsetTop;
            window.scrollTo({ top: top, left: 0, behavior: 'smooth' });
        },
        async clickBack() {
            await this.saveAllChanges();
            this.$router.push("/experiments/design/experiment-configuration/" + this.experimentID);
        },
        async clickNext() {
            await this.saveAllChanges()
            this.$router.push("/experiments/design/experiment-parameters/" + this.experimentID);
        },
        clickNextOperation() {
            let index = this.findNextOperation(this.selectedOperation);
            if (index !== -1) {
                this.selectedOperation = index;
            } else {
                index = this.taskSequenceData.map(item => item.task_sequence.start).indexOf(true);
                this.selectedOperation = index;
            }
            this.selectedOperationChange();
        },
        clickPreviousOperation() {
            let index = this.findPreviousOperation(this.selectedOperation);
            if (index !== -1) {
                this.selectedOperation = index;
            } else {
                index = this.taskSequenceData.map(item => item.task_sequence.next_operation).indexOf(null);
                this.selectedOperation = index;
            }
            this.selectedOperationChange();
        },
        selectedOperationChange() {
            let validExperimentAssets = this.assetData.filter(item => item.asset.operation_to_locations.length > 0);
            // operation to location may need to be iterated in the future
            console.log(this.taskSequenceData[this.selectedOperation]);
            let selectedExperimentAssets = validExperimentAssets.filter(item => item.asset.operation_to_locations[0].operation_id == this.taskSequenceData[this.selectedOperation].task_sequence.operation_id);
            if (selectedExperimentAssets.length > 0) {
                let selectedAssets = selectedExperimentAssets.map(item => item.asset);
                this.selectedAssets = selectedAssets.map(({ operation_to_locations, ...rest }) => rest);
            } else {
                this.selectedAssets = [{ Status: "No Associated Assets" }];
            }
            this.processTimeElementChange();
        },
        processTimeElementChange() {
            if (this.processTimeSettings.applyToAll) {
                this.processTimeSettings.elements = [];
                let processTimes = this.processTimeData.filter(e => e.process_time.asset_id == this.selectedAssets[0].asset_id);
                this.processTimeSettings.elements.push({
                    names: this.selectedAssets.map(e => e.display_name),
                    values: processTimes.map(e => e.process_time.process_time)
                })
            } else {
                this.processTimeSettings.elements = [];
                this.selectedAssets.forEach(asset => {
                    let processTimes = this.processTimeData.filter(e => e.process_time.asset_id == asset.asset_id);
                    this.processTimeSettings.elements.push({
                        names: [asset.display_name],
                        values: processTimes.map(e => e.process_time.process_time)
                    })
                })
            }
        },
        handleNumberOfSamplesChange({ target }) {
            let samples = parseInt(target.value);
            let values = this.processTimeSettings.elements[target.dataset.index].values;
            if (samples > values.length) {
                for (let i = values.length; i < samples; i++) {
                    values.push(0);
                }
            } else if (samples < values.length) {
                let stop = values.length;
                for (let i = samples; i < stop; i++) {
                    values.pop();
                }
            }
        },
        startDrag(e, task) {
            e.dataTransfer.dropEffect = 'move';
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('taskPosition', task.position);
        },
        onDrop(e, dropPosition) {
            // e.preventDefault();
            const taskPosition = parseInt(e.dataTransfer.getData('taskPosition'));
            const task = this.formattedTaskSequenceData.find(e => e.position == taskPosition);
            if (taskPosition < dropPosition) {
                for (let i = taskPosition + 1; i <= dropPosition; i++) {
                    this.formattedTaskSequenceData.find(e => e.position == i).position--
                }
            } else {
                for (let i = taskPosition - 1; i >= dropPosition; i--) {
                    this.formattedTaskSequenceData.find(e => e.position == i).position++
                }
            }
            task.position = dropPosition;
            this.formattedTaskSequenceData.sort((a, b) => a.position - b.position);
            this.taskContainsOperation();
        },
        taskContainsOperation() {
            this.formattedTaskSequenceData.forEach(task => {
                console.log(task);

            })
        },
        operationMapSelectionChange(e) {
            console.log(e);
        }
    },
    mounted() {
        this.getData();
    },
    // watch: {

    // }
}
</script>

<style>
.content h1 {
    text-align: left;
}

#input-collapsables .collapse-button {
    background-color: transparent;
    color: var(--black);
    padding: 10px;
    margin: 0;
}

#input-collapsables .collapse-button:active {
    color: var(--white);
    background-color: var(--secondary-blue);
}

#input-collapsables .collapsable-header {
    border-bottom: 1px solid var(--black);
    font-weight: normal;
    padding: 10px;
    align-items: center;
}

#input-collapsables .collapsable {
    /* padding: 20px; */
    height: 0px;
    overflow: hidden;
    transition: all 0.5s;
}

/* #input-collapsables .collapsed {
    height: 0;
    padding: 0;
} */

#input-collapsables .open {
    height: auto;
    padding: 20px;
}

#phases-cells-operations ul,
#locations-processing-times ul {
    padding-left: 40px;
}

.drop-zone {
    border-top: 1px solid var(--tertiary-gray);
}

.phase::before,
.cell::before,
.operation::before {
    position: absolute;
    --size: 28px;
    left: calc(-1 * var(--size) + 32px);
    line-height: var(--size);
    width: var(--size);
    height: var(--size);
    top: 3px;
    border-radius: 50%;
    text-align: center;
}

.phase,
.cell,
.operation {
    padding: 10px 10px 10px 40px;
    position: relative;
}

/* .phase {
    margin-left: 0;
} */

.cell {
    margin-left: 30px;
}

.operation {
    margin-left: 60px;
    color: var(--secondary-blue);
}

.phase::before {
    content: 'P';
    color: var(--white);
    border: 2px solid var(--primary-orange);
    background-color: var(--primary-orange);
}

.cell::before {
    content: 'C';
    color: var(--white);
    border: 2px solid var(--secondary-green);
    background-color: var(--secondary-green);
}

.operation::before {
    content: 'O';
    color: var(--white);
    border: 2px solid var(--primary-light-blue);
    background-color: var(--primary-light-blue);
}

.no-operation {
    text-decoration: line-through;
}

.no-operation::before {
    background-color: var(--tertiary-gray);
}

.selected-operation {
    background-color: var(--tertiary-blue);
    color: var(--white);
    border-radius: 10px;
}

.view-window {
    height: 320px;
    overflow-y: scroll;
}

.large-icon {
    font-size: 80px;
}

.process-time-input {
    border: none;
    margin: 4px;
    width: 50px;
}</style>