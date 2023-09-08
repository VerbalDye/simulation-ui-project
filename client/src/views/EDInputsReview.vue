<template>
    <LoadingModal :display="loading"/>
    <Header />
    <div class="site-container">
        <Sidebar />
        <ExperimentDesignerSidebar currentPage="2" />
        <div class="content">
            <h1>3. Inputs Definition & Review</h1>
            <div id="input-collapsables">
                <Collapsable title="Site Selection" name="site" next="phases-cells-operations" :defaultOpen="true">
                    <form
                        @change="this.selectedSite = document.querySelector(`input[name='site-selection']:checked`).value">
                        <label v-for="site in siteData" :for="site.site_id" class="radio-container">
                            <input :id="site.site_id" type="radio" name="site-selection" class="checkbox"
                                :value="site.site_id">
                            <span class="radio-checkmark"></span>
                            {{ site.site_name }}
                        </label>
                    </form>
                </Collapsable>
                <Collapsable title="Production Process" name="production-process-settings">
                    <Collapsable title="Phases, Cells, & Operations" name="phases-cells-operations" back="site"
                        next="locations-processing-times" :heading="3">
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
                    </Collapsable>
                    <Collapsable title="Locations & Processing Times" name="locations-processing-times"
                        back="phases-cells-operations" next="buildings" :heading="3">
                        <div class="flex-between align-top">
                            <div class="flex-vertical">
                                <div class="card-with-title">
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
                                <div v-if="this.assetData && this.taskSequenceData" class="card-with-title">
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
                                <div class="card-with-title">
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
                                        @toggle-change="assetInclusionChange" :excludedColumns="['destinations']" :id="1"
                                        :toggle="'Include?'" :toggleData="this.selectedAssetInclusion" />
                                </div>
                            </div>
                        </div>
                        <div class="card-with-title">
                            <h4 class="card-title">Processing Times</h4>
                            <button @click="resetProcessingTimeChanges">Reset All Changes</button>
                            <div class="flex-between">
                                <div>
                                    <table class="grid-less">
                                        <tr>
                                            <th>Use Default?*</th>
                                            <td>
                                                <label class="switch">
                                                    <input type="checkbox" checked name="process-time-default-input"
                                                        @input="e => this.processTimeSettings.default = e.target.checked">
                                                    <span class="slider round"></span>
                                                </label>
                                            </td>
                                        </tr>
                                        <tr v-if="!processTimeSettings.default">
                                            <th>Apply to all?*</th>
                                            <td>
                                                <label class="switch">
                                                    <input type="checkbox" @input="applyToAllChange" checked
                                                        name="process-time-apply-to-all-input">
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
                                                                    :value="Object.keys(processTimeSettings.elements[selectedAssets[0].asset_id].values).length"
                                                                    class="small-number-input"
                                                                    :name="'samples-' + selectedAssets[0].asset_id"
                                                                    @input="handleNumberOfSamplesChange(selectedAssets[0].asset_id, $event)">
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th><i class="bi bi-clock-fill"></i> Enter Processing Times
                                                                (minutes)*</th>
                                                            <td>
                                                                <div class="flex-left">
                                                                    <input
                                                                        v-for="(value, key) in this.processTimeSettings.elements[selectedAssets[0].asset_id].values"
                                                                        class="small-number-input" type="number" step="0.01"
                                                                        :value="value" :name="'times-' + key"
                                                                        @input="handleProcessTimeDataChange(key, $event)">
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </div>
                                            <div v-else>
                                                <div v-for="(element, asset_id) in processTimeSettings.elements">
                                                    <p>{{ element.name }}</p>
                                                    <table class="grid-less">
                                                        <tr>
                                                            <th><i class="bi bi-hash"></i> Number of Samples*</th>
                                                            <td>
                                                                <input type="number"
                                                                    :value="Object.keys(element.values).length"
                                                                    class="small-number-input" :name="'samples-' + asset_id"
                                                                    @input="handleNumberOfSamplesChange(asset_id, $event)">
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th><i class="bi bi-clock-fill"></i> Enter Processing Times
                                                                (minutes)*</th>
                                                            <td>
                                                                <div class="flex-left">
                                                                    <input v-for="(value, key) in element.values"
                                                                        class="small-number-input" type="number" step="0.01"
                                                                        :value="value" :name="'times-' + key"
                                                                        @input="handleProcessTimeDataChange(key, $event)">
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
                    </Collapsable>
                </Collapsable>
                <Collapsable title="Resources" name="resources">
                    <Collapsable title="Buildings" name="buildings" next="equipment-machines"
                        back="locations-processing-times" :heading="3">
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
                            <div class="card-with-title">
                                <h4 class="card-title">Hours of Operation</h4>
                                <table class="grid-less">
                                    <tr>
                                        <th>Use Default?*</th>
                                        <td>
                                            <label class="switch">
                                                <input type="checkbox" name="hoo-default-input">
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
                    </Collapsable>
                    <Collapsable title="Equipment/Machines" name="equipment-machines" next="cores-tools" back="buildings"
                        :heading="3">TBD</Collapsable>
                    <Collapsable title="Cores & Tools" name="cores-tools" next="materials" back="equipment-machines"
                        :heading="3">
                        <div>
                            <button disabled>Upload Core List</button>
                            <div v-if="coreModelData">
                                <SmartTable :jsonData="coreModelData" :advancedSearchEnabled="false" :id="3"
                                    @toggle-change="e => e.checked ? coreUsage[e.index] = true : coreUsage[e.index] = false"
                                    toggle="Use?" :toggleData="this.coreUsage" />
                            </div>
                        </div>
                    </Collapsable>
                    <Collapsable title="Materials" name="materials" next="labor" back="cores-tools" :heading="3">TBD
                    </Collapsable>
                    <Collapsable title="Labor" name="labor" next="routing" back="materials" :heading="3">TBD</Collapsable>
                </Collapsable>
                <Collapsable title="Routing, Queuing, and Prioritization" name="routing-queuing-prioritization">
                    <div class="flex-between">
                        <div class="card-with-title">
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
                        <div v-if="assetData && taskSequenceData" class="card-with-title">
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
                        <Collapsable title="Routing" name="routing" back="labor" next="queuing">
                            <div v-if="routingData">
                                <SmartTable :jsonData="routingData.map(item => item.routing)" :advancedSearchEnabled="false"
                                    :excludedColumns="['destinations']" :id="2" />
                            </div>
                        </Collapsable>
                        <Collapsable title="Queuing" name="queuing" back="routing" next="priority">TBD</Collapsable>
                        <Collapsable title="Priority" name="priority" back="queuing" next="transportation">TBD</Collapsable>
                    </div>
                </Collapsable>
                <Collapsable title="Transportation" name="transportation" back="priority" next="demand">TBD</Collapsable>
                <Collapsable title="Demand" name="demand" back="transportation" next="review">
                    <div class="card-with-title">
                        <h4 class="card-title">Demand Input</h4>
                        <table class="grid-less">
                            <tr>
                                <th>Use Default?*</th>
                                <td>
                                    <label class="switch">
                                        <input type="checkbox" name="demand-default-input" checked
                                            @input="e => this.demandSettings.default = e.target.checked">
                                        <span class="slider round"></span>
                                    </label>
                                </td>
                            </tr>
                        </table>
                        <div v-if="!demandSettings.default">
                            <div v-if="!demandSettings.backlog">
                                <h4>Start Date</h4>
                                <input type="date" :value="demandSettings.startDate" name="demand-start-date-input"
                                    class="space" @input="e => demandSettings.startDate = e.target.value">
                                <h4>Daily Target</h4>
                                <table class="grid-less">
                                    <tr>
                                        <th>Min</th>
                                        <td>
                                            <input type="number" class="small-number-input" step="1"
                                                name="demand-target-min-input" :value="demandSettings.dailyTarget.min"
                                                @input="e => demandSettings.dailyTarget.max = e.target.value">
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Max</th>
                                        <td>
                                            <input type="number" class="small-number-input" step="1"
                                                name="demand-target-max-input" :value="demandSettings.dailyTarget.max"
                                                @input="e => demandSettings.dailyTarget.max = e.target.value">
                                        </td>
                                    </tr>
                                </table>
                                <h4>Job Mix (%)</h4>
                                <table class="grid-less">
                                    <tr v-for="({ job_mix }) in jobMixData">
                                        <th>{{ job_mix.display_name }}</th>
                                        <td><input type="number" class="small-number-input" step="1"
                                                @input="handleJobMixChange(job_mix.job_mix_id, $event)"
                                                :name="'demand-mix-' + job_mix.job_type + '-input'" :value="job_mix.percent"
                                                min="0" max="100"></td>
                                    </tr>
                                </table>
                                <h4>Delivery Days</h4>
                                <table class="grid-less">
                                    <tr>
                                        <th>Sun</th>
                                        <td>
                                            <label class="switch">
                                                <input type="checkbox" name="demand-delivery-sun-input"
                                                    :checked="demandSettings.deliveryDays.sun.enabled"
                                                    @input="e => demandSettings.deliveryDays.sun.enabled = e.target.checked">
                                                <span class="slider round"></span>
                                            </label>
                                        </td>
                                        <td>
                                            <input v-if="demandSettings.deliveryDays.sun.enabled" type="time"
                                                :value="demandSettings.deliveryDays.sun.time"
                                                @input="e => demandSettings.deliveryDays.sun.time = e.target.value">
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Mon</th>
                                        <td>
                                            <label class="switch">
                                                <input type="checkbox" name="demand-delivery-mon-input"
                                                    :checked="demandSettings.deliveryDays.mon.enabled"
                                                    @input="e => demandSettings.deliveryDays.mon.enabled = e.target.checked">
                                                <span class="slider round"></span>
                                            </label>
                                        </td>
                                        <td>
                                            <input v-if="demandSettings.deliveryDays.mon.enabled" type="time"
                                                :value="demandSettings.deliveryDays.mon.time"
                                                @input="e => demandSettings.deliveryDays.mon.time = e.target.value">
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Tue</th>
                                        <td>
                                            <label class="switch">
                                                <input type="checkbox" name="demand-delivery-tue-input"
                                                    :checked="demandSettings.deliveryDays.tue.enabled"
                                                    @input="e => demandSettings.deliveryDays.tue.enabled = e.target.checked">
                                                <span class="slider round"></span>
                                            </label>
                                        </td>
                                        <td>
                                            <input v-if="demandSettings.deliveryDays.tue.enabled" type="time"
                                                :value="demandSettings.deliveryDays.tue.time"
                                                @input="e => demandSettings.deliveryDays.tue.time = e.target.value">
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Wed</th>
                                        <td>
                                            <label class="switch">
                                                <input type="checkbox" name="demand-delivery-wed-input"
                                                    :checked="demandSettings.deliveryDays.wed.enabled"
                                                    @input="e => demandSettings.deliveryDays.wed.enabled = e.target.checked">
                                                <span class="slider round"></span>
                                            </label>
                                        </td>
                                        <td>
                                            <input v-if="demandSettings.deliveryDays.wed.enabled" type="time"
                                                :value="demandSettings.deliveryDays.wed.time"
                                                @input="e => demandSettings.deliveryDays.wed.time = e.target.value">
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Thu</th>
                                        <td>
                                            <label class="switch">
                                                <input type="checkbox" name="demand-delivery-thu-input"
                                                    :checked="demandSettings.deliveryDays.thu.enabled"
                                                    @input="e => demandSettings.deliveryDays.thu.enabled = e.target.checked">
                                                <span class="slider round"></span>
                                            </label>
                                        </td>
                                        <td>
                                            <input v-if="demandSettings.deliveryDays.thu.enabled" type="time"
                                                :value="demandSettings.deliveryDays.thu.time"
                                                @input="e => demandSettings.deliveryDays.thu.time = e.target.value">
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Fri</th>
                                        <td>
                                            <label class="switch">
                                                <input type="checkbox" name="demand-delivery-fri-input"
                                                    :checked="demandSettings.deliveryDays.fri.enabled"
                                                    @input="e => demandSettings.deliveryDays.fri.enabled = e.target.checked">
                                                <span class="slider round"></span>
                                            </label>
                                        </td>
                                        <td>
                                            <input v-if="demandSettings.deliveryDays.fri.enabled" type="time"
                                                :value="demandSettings.deliveryDays.fri.time"
                                                @input="e => demandSettings.deliveryDays.fri.time = e.target.value">
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Sat</th>
                                        <td>
                                            <label class="switch">
                                                <input type="checkbox" name="demand-delivery-sat-input"
                                                    :checked="demandSettings.deliveryDays.sat.enabled"
                                                    @input="e => demandSettings.deliveryDays.sat.enabled = e.target.checked">
                                                <span class="slider round"></span>
                                            </label>
                                        </td>
                                        <td>
                                            <input v-if="demandSettings.deliveryDays.sat.enabled" type="time"
                                                :value="demandSettings.deliveryDays.sat.time"
                                                @input="e => demandSettings.deliveryDays.sat.time = e.target.value">
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div v-else>
                                <button @click="downloadTemplate">Download Template</button>
                                <div>
                                    <label for="backlog-input">Upload Backlog</label>
                                    <input type="file" name="backlog-input" id="backlog-input"
                                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
                                </div>
                                <div class="flex-right">
                                    <button @click="uploadBacklog">Upload</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Collapsable>
                <Collapsable title="Review" name="review" back="demand">TBD</Collapsable>
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
import Collapsable from '@/components/Collapsable.vue';
import LoadingModal from '@/components/LoadingModal.vue';
import dataRequest from '@/utils/dataRequest';
import dayjs from 'dayjs';
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
            jobMixData: null,
            coreModelData: null,
            jobListData: null,
            selectedOperation: 0,
            selectedAssets: null,
            hoursOfOperationData: null,
            loading: false,
            processTimeSettings: {
                default: true,
                applyToAll: true,
                discrete: true,
                elements: {},
                ids: []
            },
            demandSettings: {
                default: true,
                backlog: false,
                lastJobMixIDs: [],
                deliveryDays: {
                    mon: { enabled: true, time: "10:00" },
                    tue: { enabled: true, time: "10:00" },
                    wed: { enabled: true, time: "10:00" },
                    thu: { enabled: true, time: "10:00" },
                    fri: { enabled: true, time: "10:00" },
                    sat: { enabled: false, time: "10:00" },
                    sun: { enabled: false, time: "10:00" },
                },
                dailyTarget: {
                    min: 45,
                    max: 70
                },
                startDate: dayjs().format('YYYY-MM-DD').toString()
            },
            processTimeData: null,
            backupProcessTimeData: null,
            changedProcessTimeData: [],
            excludedAssets: [],
            selectedAssetInclusion: null,
            coreUsage: []
        }
    },
    mixins: [titleMixin],
    title: 'Experiment Designer',
    components: { Sidebar, Header, ExperimentDesignerSidebar, ExperimentDesignerSidebar, LayoutMaker, SmartTable, Collapsable, LoadingModal },
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
            // console.log(data);
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
            // let iterations = []
            // data.forEach(e => {
            //     if (iterations.indexOf(e.iteration_number) == -1) {
            //         iterations.push(e.iteration_number)
            //     }
            //     console.log(iterations);
            // })
            let secondIterationData = data.filter(e => e.iteration_number == 1);
            if (secondIterationData.length > 0) {
                this.backupProcessTimeData = JSON.parse(JSON.stringify(secondIterationData));
                this.processTimeData = secondIterationData;
            } else {
                this.backupProcessTimeData = JSON.parse(JSON.stringify(data));
                this.processTimeData = data;
            }
        },
        async getRoutingData() {
            let data = await dataRequest("/api/experiment/routing/" + this.experimentID, "GET");
            this.routingData = data;
        },
        async getJobMixData() {
            let data = await dataRequest("/api/experiment/job-mix/" + this.experimentID, "GET");
            // console.log(data)
            this.jobMixData = data;
        },
        async getJobListData() {
            let data = await dataRequest("/api/experiment/job-list/" + this.experimentID, "GET");
            console.log(data)
            this.jobListData = data;
        },
        async getCoreModelData() {
            let data = await dataRequest("/api/core-model", "GET");
            console.log(data);
            this.coreUsage = data.map(e => true);
            this.coreModelData = data;
        },
        async getData() {
            this.getExperimentID();
            this.getCoreModelData();
            this.getHoursOfOperationData();
            this.getOperationToLocationData();
            this.getRoutingData();
            this.getJobMixData();
            this.getJobListData();
            await this.getAssetData();
            this.excludedAssets = this.assetData.filter(e => e.asset.capacity == 0).map(e => e.asset.asset_id);
            await this.getTaskSequenceData();
            await this.getProcessTimeData();
            this.selectedOperationChange();
            let experimentData = await this.getExperimentData();
            if (experimentData.scenario.scenario_id == 8) {
                this.demandSettings.backlog = true;
            }
            await this.getSiteData();
            this.selectedSite = experimentData.experiment_site.site_id;
            const siteSelectionEl = document.querySelector('input[value="' + experimentData.experiment_site.site_id + '"]');
            siteSelectionEl.checked = true;
        },
        downloadTemplate() {
            window.open('/api/experiment/backlog/template');
        },
        async saveAllChanges() {
            this.loading = true;
            return await Promise.all([
                dataRequest("/api/experiment/site/" + this.experimentID, "PUT", JSON.stringify({ site_id: this.selectedSite })),
                this.saveProcessTimeChanges(),
                this.saveAssetInclusionData(),
                this.generateArrivalData()
            ])
        },
        async saveProcessTimeChanges() {
            if (this.processTimeData[0].iteration_number == 1) {
                let postProcessTimeData = this.changedProcessTimeData.filter(e => e.method == 'POST');
                let putProcessTimeData = this.changedProcessTimeData.filter(e => e.method == 'PUT');
                let deleteProcessTimeData = this.changedProcessTimeData.filter(e => e.method == 'DELETE').map(e => parseInt(e.process_time_id));
                if (postProcessTimeData.length) {
                    await dataRequest("/api/experiment/process-time/bulk/" + this.experimentID, "POST", JSON.stringify({ data: postProcessTimeData, iteration_number: 1 }))
                }
                if (putProcessTimeData.length) {
                    await dataRequest("/api/experiment/process-time/bulk/" + this.experimentID, "PUT", JSON.stringify({ data: putProcessTimeData, iteration_number: 1 }))
                }
                if (deleteProcessTimeData.length) {
                    await dataRequest("/api/experiment/process-time/bulk/" + this.experimentID, "DELETE", JSON.stringify({ data: deleteProcessTimeData, iteration_number: 1 }))
                }
            } else {
                await dataRequest("/api/experiment/process-time/bulk/" + this.experimentID, "POST", JSON.stringify({ data: this.processTimeData.map(e => e.process_time), iteration_number: 1 }))
            }

        },
        async saveAssetInclusionData() {
            let enabledAssets = this.assetData.filter(e => e.asset.capacity == 0 && this.excludedAssets.indexOf(e.asset.asset_id) == -1).map(e => e.asset).map(({ capacity, ...rest }) => {
                rest["capacity"] = "RESET"
                return rest
            });
            let disabledAssets = this.assetData.filter(e => this.excludedAssets.indexOf(e.asset.asset_id) !== -1).map(e => e.asset).map(({ capacity, ...rest }) => {
                rest["capacity"] = 0
                return rest
            });
            let assets = enabledAssets.concat(disabledAssets);
            await dataRequest("/api/experiment/asset/bulk/" + this.experimentID, "PUT", JSON.stringify({ data: assets }));
        },
        async uploadBacklog() {
            let backlogInput = document.getElementById("backlog-input");
            let formData = new FormData();
            formData.append('file', backlogInput.files[0]);
            await dataRequest("/api/experiment/backlog/file/" + this.experimentID, "POST", formData)
            console.log(backlogInput.files[0]);
        },
        async generateArrivalData() {
            let arrivalData = {
                expId: this.experimentID,
                numReplications: 3,
                start_date: this.demandSettings.startDate,
                min_jobs: this.demandSettings.dailyTarget.min,
                max_jobs: this.demandSettings.dailyTarget.max,
                stators: this.jobMixData.find(e => e.job_mix.job_type == "STATORS").job_mix.percent,
                relines: this.jobMixData.find(e => e.job_mix.job_type == "RELINES").job_mix.percent,
                rnd: this.jobMixData.find(e => e.job_mix.job_type == "R&D").job_mix.percent,
                sun: this.demandSettings.deliveryDays.sun.enabled,
                mon: this.demandSettings.deliveryDays.mon.enabled,
                tues: this.demandSettings.deliveryDays.tue.enabled,
                wed: this.demandSettings.deliveryDays.wed.enabled,
                thur: this.demandSettings.deliveryDays.thu.enabled,
                fri: this.demandSettings.deliveryDays.fri.enabled,
                sat: this.demandSettings.deliveryDays.sat.enabled,
                sun_time: this.demandSettings.deliveryDays.sun.time,
                mon_time: this.demandSettings.deliveryDays.mon.time,
                tues_time: this.demandSettings.deliveryDays.tue.time,
                wed_time: this.demandSettings.deliveryDays.wed.time,
                thur_time: this.demandSettings.deliveryDays.thu.time,
                fri_time: this.demandSettings.deliveryDays.fri.time,
                sat_time: this.demandSettings.deliveryDays.sat.time,
            }
            console.log(arrivalData);
            await dataRequest("/api/experiment/arrival/generate", "POST", JSON.stringify(arrivalData));
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
            let selectedExperimentAssets = validExperimentAssets.filter(item => item.asset.operation_to_locations[0].operation_id == this.taskSequenceData[this.selectedOperation].task_sequence.operation_id);
            if (selectedExperimentAssets.length > 0) {
                let selectedAssets = selectedExperimentAssets.map(item => item.asset);
                this.selectedAssets = selectedAssets.map(({ operation_to_locations, ...rest }) => rest);
                this.selectedAssetInclusion = this.selectedAssets.map(e => this.excludedAssets.indexOf(e.asset_id) == -1);
            } else {
                this.selectedAssets = [{ Status: "No Associated Assets" }];
            }
            this.processTimeElementChange();
        },
        applyToAllChange(e) {
            this.processTimeSettings.applyToAll = e.target.checked;
            this.processTimeElementChange();
        },
        processTimeElementChange() {
            this.processTimeSettings.elements = {};
            this.selectedAssets.forEach(asset => {
                let processTimes = this.processTimeData.filter(e => e.process_time.asset_id == asset.asset_id);
                this.processTimeSettings.elements[asset.asset_id] = {
                    name: asset.display_name,
                    values: {}
                }
                processTimes.forEach(e => {
                    this.processTimeSettings.elements[asset.asset_id].values[e.experiment_process_time_id] = e.process_time.process_time;
                })
            })
        },
        // Later convert to beautiful function to handle any data change
        processTimeDataChange(mode, { process_time, experiment_process_time_id, operation_id, asset_id }) {
            process_time = parseFloat(process_time);
            operation_id = parseInt(operation_id);
            asset_id = parseInt(asset_id);
            if (mode == "add" && operation_id !== undefined && asset_id !== undefined) {
                if (!process_time) { process_time = 0 }
                let entryIds = this.processTimeData.filter(e => e.process_time.asset_id == asset_id && e.process_time.operation_id == operation_id).map(e => e.experiment_process_time_id);
                let backupTimes = this.backupProcessTimeData.filter(e => e.process_time.asset_id == asset_id && e.process_time.operation_id == operation_id).filter(e => entryIds.indexOf(e.experiment_process_time_id) == -1);
                if (backupTimes.length > 0) {
                    let entry = this.processTimeData[this.processTimeData.push(backupTimes[0]) - 1];
                    let index = this.changedProcessTimeData.findIndex(e => e.experiment_process_time_id == backupTimes[0].experiment_process_time_id);
                    if (index !== -1 && this.changedProcessTimeData[index].method == 'DELETE') {
                        if (process_time) {
                            entry.process_time.process_time = process_time;
                            this.changedProcessTimeData[index].method = 'PUT';
                            this.changedProcessTimeData[index].process_time = process_time;
                        } else {
                            this.changedProcessTimeData.splice(index, 1);
                        }
                    } else {
                        throw new Error('Adding Entry Failed: No Delete Record Exists');
                    }
                } else {
                    let id = "new-" + Math.floor(Math.random() * 1000000);
                    this.processTimeData.push({
                        experiment_process_time_id: id,
                        process_time: {
                            process_time: process_time,
                            asset_id: asset_id,
                            operation_id: operation_id
                        }
                    })
                    this.changedProcessTimeData.push({
                        process_time: process_time,
                        experiment_process_time_id: id,
                        asset_id: asset_id,
                        operation_id: operation_id,
                        method: 'POST'
                    });
                }
            } else if (mode == "remove" && experiment_process_time_id !== undefined) {
                let data = this.processTimeData.find(e => e.experiment_process_time_id == experiment_process_time_id);
                this.processTimeData.splice(this.processTimeData.findIndex(e => e.experiment_process_time_id == experiment_process_time_id), 1);
                let index = this.changedProcessTimeData.findIndex(e => e.experiment_process_time_id == experiment_process_time_id);
                if (experiment_process_time_id.toString().includes('new')) {
                    this.changedProcessTimeData.splice(index, 1);
                } else {
                    if (index == -1) {
                        this.changedProcessTimeData.push({
                            process_time: 0,
                            experiment_process_time_id: experiment_process_time_id,
                            asset_id: data.process_time.asset_id,
                            operation_id: data.process_time.operation_id,
                            process_time_id: data.process_time_id,
                            method: 'DELETE'
                        });
                    } else {
                        this.changedProcessTimeData[index].method = 'DELETE'
                    }
                }
            } else if (mode == "change" && process_time !== undefined && experiment_process_time_id !== undefined) {
                let data = this.processTimeData.find(e => e.experiment_process_time_id == experiment_process_time_id);
                data.process_time.process_time = process_time;
                let processTimeEntry = this.changedProcessTimeData.find(e => e.experiment_process_time_id == experiment_process_time_id);
                if (!processTimeEntry) {
                    this.changedProcessTimeData.push({
                        experiment_process_time_id: experiment_process_time_id,
                        asset_id: data.process_time.asset_id,
                        operation_id: data.process_time.operation_id,
                        process_time: process_time,
                        process_time_id: data.process_time_id,
                        method: 'PUT'
                    });
                } else {
                    processTimeEntry.process_time = process_time;
                }
            } else if (mode == "overwrite" && operation_id !== undefined && asset_id !== undefined) {
                let template = this.processTimeData.filter(e => e.process_time.operation_id == operation_id && e.process_time.asset_id == asset_id);
                let assetIds = this.operationToLocationData.filter(e => e.operation_to_location.operation_id == operation_id).map(e => e.operation_to_location.asset_id);
                assetIds.splice(assetIds.indexOf(asset_id), 1);
                assetIds.forEach(id => {
                    this.processTimeData.filter(e => e.process_time.operation_id == operation_id && e.process_time.asset_id == id).forEach(entry => {
                        this.processTimeDataChange("remove", { experiment_process_time_id: entry.experiment_process_time_id });
                    })
                    template.forEach(entry => {
                        this.processTimeDataChange("add", { operation_id: operation_id, asset_id: id, process_time: entry.process_time.process_time });
                    })
                })
            } else {
                throw new Error('Incorrect Inputs Provided: ' + operation_id + " " + asset_id + " " + experiment_process_time_id + " " + process_time);
            }
        },
        handleNumberOfSamplesChange(asset_id, { target }) {
            let selectedOperation = this.taskSequenceData[this.selectedOperation];
            let samples = parseInt(target.value);
            let keys = Object.keys(this.processTimeSettings.elements[asset_id].values);
            if (samples > keys.length) {
                for (let i = keys.length; i < samples; i++) {
                    this.processTimeDataChange("add", { operation_id: selectedOperation.task_sequence.operation_id, asset_id: asset_id });
                }
            } else if (samples < keys.length) {
                let stop = keys.length;
                for (let i = samples; i < stop; i++) {
                    this.processTimeDataChange("remove", { experiment_process_time_id: keys[i] });
                }
            }
            if (this.processTimeSettings.applyToAll) {
                this.processTimeDataChange("overwrite", { operation_id: selectedOperation.task_sequence.operation_id, asset_id: asset_id });
            }
            this.processTimeElementChange();
        },
        handleProcessTimeDataChange(id, e) {
            let selectedOperation = this.taskSequenceData[this.selectedOperation];
            let data = this.processTimeData.find(e => e.experiment_process_time_id == id);
            this.processTimeDataChange("change", { experiment_process_time_id: id, process_time: e.target.value });
            if (this.processTimeSettings.applyToAll) {
                this.processTimeDataChange("overwrite", { operation_id: selectedOperation.task_sequence.operation_id, asset_id: data.process_time.asset_id })
            }
            this.processTimeElementChange();
        },
        resetProcessingTimeChanges() {
            this.processTimeData = this.backupProcessTimeData;
            this.changedProcessTimeData = [];
        },
        handleJobMixChange(id, { target }) {
            if (this.demandSettings.lastJobMixIDs.length == 0) {
                let placeholderEntry = this.jobMixData.filter(e => e.job_mix.job_mix_id !== id)[0];
                this.demandSettings.lastJobMixIDs.push(placeholderEntry.job_mix.job_mix_id);
                this.demandSettings.lastJobMixIDs.push(id);
            } else if (this.demandSettings.lastJobMixIDs[0] == id || this.demandSettings.lastJobMixIDs[1] !== id) {
                this.demandSettings.lastJobMixIDs.shift()
                this.demandSettings.lastJobMixIDs.push(id);
            }
            let targetPercent = parseInt(target.value);
            let targetEntry = this.jobMixData.find(e => e.job_mix.job_mix_id == id);
            let lastTargetEntry = this.jobMixData.find(e => e.job_mix.job_mix_id == this.demandSettings.lastJobMixIDs[0]);
            let slackEntry = this.jobMixData.find(e => this.demandSettings.lastJobMixIDs.indexOf(e.job_mix.job_mix_id) == -1);
            if (targetPercent > 100 || targetPercent < 0) {
                throw new Error('Percent Out of Bounds: Must be between 0-100')
            } else {
                if (targetPercent + lastTargetEntry.job_mix.percent < 100) {
                    slackEntry.job_mix.percent = 100 - (targetPercent + lastTargetEntry.job_mix.percent);
                    targetEntry.job_mix.percent = targetPercent;
                } else {
                    slackEntry.job_mix.percent = 0;
                    lastTargetEntry.job_mix.percent = 100 - targetPercent;
                    targetEntry.job_mix.percent = targetPercent;
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
        assetInclusionChange(e) {
            let index = this.excludedAssets.indexOf(e.data.asset_id);
            if (index !== -1 && e.checked) {
                this.excludedAssets.splice(index, 1);
            } else if (!e.checked && index == -1) {
                this.excludedAssets.push(e.data.asset_id);
            }
        },
        operationMapSelectionChange(e) {
            console.log(e);
        }
    },
    mounted() {
        this.getData();
    }
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

.small-number-input {
    border: none;
    margin: 4px;
    width: 50px;
}
</style>