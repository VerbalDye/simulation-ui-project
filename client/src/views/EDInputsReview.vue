<template>
    <WarningModal :display="warning">
        <p class="space">This experiment is current running. Input changes are not permitted. Please follow the link below
            to check on simulation status.</p>
        <router-link :to="'/experiments/design/simulation-start/' + this.experimentID" class="link-button">Simulation
            Status</router-link>
    </WarningModal>
    <LoadingModal :display="loading" estimated-loading-time="12000" />
    <Header />
    <div class="site-container">
        <Sidebar />
        <ExperimentDesignerSidebar currentPage="2" />
        <div class="content">
            <h1>3. Inputs Definition & Review</h1>
            <div id="input-collapsables">
                <Collapsable @toggle-collapse="collapsableToggleChange" title="Site Selection" name="site"
                    next="phases-cells-operations" :defaultOpen="true" :reset="collapsableStatus['site']">
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
                <Collapsable @toggle-collapse="collapsableToggleChange" title="Production Process"
                    name="production-process-settings" :reset="collapsableStatus['production-process-settings']">
                    <Collapsable @toggle-collapse="collapsableToggleChange" title="Phases, Cells, & Operations"
                        name="phases-cells-operations" back="site" next="locations-processing-times" :heading="3"
                        :reset="collapsableStatus['phases-cells-operations']">
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
                    <Collapsable @toggle-collapse="collapsableToggleChange" title="Locations & Processing Times"
                        name="locations-processing-times" back="phases-cells-operations" next="buildings" :heading="3"
                        :reset="collapsableStatus['locations-processing-times']">
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
                                    <div v-if="selectedAssets" class="limit-width">
                                        <SmartTable :jsonData="selectedAssets" :advancedSearchEnabled="false"
                                            @toggle-change="assetInclusionChange" :excludedColumns="['destinations']"
                                            :id="1" :toggle="'Include?'" :toggleData="this.selectedAssetInclusion" />
                                    </div>
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
                <Collapsable @toggle-collapse="collapsableToggleChange" title="Resources" name="resources"
                    :reset="collapsableStatus['resources']">
                    <Collapsable @toggle-collapse="collapsableToggleChange" title="Buildings" name="buildings"
                        next="equipment-machines" back="locations-processing-times" :heading="3"
                        :reset="collapsableStatus['buildings']">
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
                    <Collapsable @toggle-collapse="collapsableToggleChange" title="Equipment/Machines"
                        name="equipment-machines" next="cores-tools" back="buildings" :heading="3"
                        :reset="collapsableStatus['equipment-machines']">TBD</Collapsable>
                    <Collapsable @toggle-collapse="collapsableToggleChange" title="Cores & Tools" name="cores-tools"
                        next="materials" back="equipment-machines" :heading="3" :reset="collapsableStatus['cores-tools']">
                        <div>
                            <button disabled>Upload Core List</button>
                            <div v-if="coreModelData" class="limit-width">
                                <SmartTable :jsonData="coreModelData" :advancedSearchEnabled="false" :id="2"
                                    :excludedColumns="['experiment_core_id', 'available']"
                                    @toggle-change="coreAvailabilityChange" toggle="Available?"
                                    :toggleData="this.coreUsage" />
                            </div>
                        </div>
                    </Collapsable>
                    <Collapsable @toggle-collapse="collapsableToggleChange" title="Materials" name="materials" next="labor"
                        back="cores-tools" :heading="3" :reset="collapsableStatus['materials']">TBD
                    </Collapsable>
                    <Collapsable @toggle-collapse="collapsableToggleChange" title="Labor" name="labor" next="routing"
                        back="materials" :heading="3" :reset="collapsableStatus['labor']">TBD</Collapsable>
                </Collapsable>
                <Collapsable @toggle-collapse="collapsableToggleChange" title="Routing, Queuing, and Prioritization"
                    name="routing-queuing-prioritization" :reset="collapsableStatus['routing-queuing-prioritization']">
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
                        <div v-if="assetData && taskSequenceData" class="card-with-title">
                            <div class="card-title">Plant Layout</div>
                            <LayoutMaker mode="routing-map" :assetData="assetData"
                                :selectedOperation="taskSequenceData[selectedOperation]"
                                @selection-change="operationMapSelectionChange" id="2" />
                        </div>
                        <div v-if="taskSequenceData" class="card">
                            <div>
                                <button @click="clickPreviousOperation"><i class="bi bi-arrow-left"></i></button>
                                <button @click="clickNextOperation"><i class="bi bi-arrow-right"></i></button>
                            </div>
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
                        <Collapsable @toggle-collapse="collapsableToggleChange" title="Routing" name="routing" back="labor"
                            next="queuing" :reset="collapsableStatus['routing']">
                            <div v-if="routingData" class="limit-width">
                                <SmartTable :jsonData="routingData.map(item => item.routing)" :advancedSearchEnabled="false"
                                    :excludedColumns="['destinations']" :id="3" />
                            </div>
                        </Collapsable>
                        <Collapsable @toggle-collapse="collapsableToggleChange" title="Queuing" name="queuing"
                            back="routing" next="priority" :reset="collapsableStatus['queuing']">TBD</Collapsable>
                        <Collapsable @toggle-collapse="collapsableToggleChange" title="Priority" name="priority"
                            back="queuing" next="transportation" :reset="collapsableStatus['priority']">TBD</Collapsable>
                    </div>
                </Collapsable>
                <Collapsable @toggle-collapse="collapsableToggleChange" title="Transportation" name="transportation"
                    back="priority" next="demand" :reset="collapsableStatus['transportation']">TBD</Collapsable>
                <Collapsable @toggle-collapse="collapsableToggleChange" title="Demand" name="demand" back="transportation"
                    next="review" :reset="collapsableStatus['demand']">
                    <div class="card-with-title">
                        <h4 class="card-title">Demand Input</h4>
                        <div v-if="!demandSettings.backlog">
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
                                                @input="e => demandSettings.dailyTarget.min = e.target.value">
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
                        </div>
                        <div v-else>
                            <button @click="downloadTemplate">Download Template</button>
                            <div v-if="this.backlogData" class="space">This experiment has Backlog Data. If you would
                                like to
                                overwrite, upload new backlog data below and click "Upload".</div>
                            <div>
                                <label for="backlog-input">Upload Backlog</label>
                                <input type="file" name="backlog-input" id="backlog-input" class="space" accept=".csv">
                            </div>
                            <div class="flex-right">
                                <button @click="uploadBacklog">Upload</button>
                            </div>
                            <div v-if="jobData && jobDropdownData" class="limit-width">
                                <SmartTable :jsonData="jobData" :advancedSearchEnabled="false" :id="4"
                                    :excludedColumns="['job_location_id', 'job_core_id']" :dropdownData="jobDropdownData"
                                    @selection-change="handleJobSelectionChange" />
                            </div>
                        </div>
                    </div>
                </Collapsable>
                <Collapsable @toggle-collapse="collapsableToggleChange" title="Review" name="review" back="demand"
                    :reset="collapsableStatus['review']">TBD</Collapsable>
            </div>
            <div class="flex-right"><button @click="clickBack">Back</button><button @click="clickNext">Next</button></div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import titleMixin from '@/mixins/titleMixin';
import Sidebar from '@/components/Sidebar.vue';
import ExperimentDesignerSidebar from '@/components/ExperimentDesignerSidebar.vue';
import LayoutMaker from '@/components/LayoutMaker.vue';
import SmartTable from '@/components/SmartTable.vue';
import Collapsable from '@/components/Collapsable.vue';
import LoadingModal from '@/components/LoadingModal.vue';
import WarningModal from '@/components/WarningModal.vue';
import dataRequest from '@/utils/dataRequest';
import csvJson from '@/utils/csvJson';
import dayjs from 'dayjs';
export default {
    data() {
        return {
            experimentData: null,
            experimentID: null,
            iteration: 0,
            operationToLocationData: null,
            siteData: null,
            selectedSite: null,
            taskSequenceData: null,
            formattedTaskSequenceData: null,
            assetData: null,
            routingData: null,
            jobMixData: null,
            jobData: null,
            coreModelData: null,
            jobListData: null,
            selectedOperation: 0,
            selectedAssets: null,
            jobDropdownData: null,
            hoursOfOperationData: null,
            backlogData: null,
            warning: false,
            loading: false,
            jobLocationChanges: {},
            jobCoreChanges: {},
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
            coreUsage: [],
            collapsableStatus: {}
        }
    },
    mixins: [titleMixin],
    title: 'Experiment Designer',
    components: { Sidebar, Header, ExperimentDesignerSidebar, ExperimentDesignerSidebar, LayoutMaker, SmartTable, Collapsable, LoadingModal, WarningModal },
    methods: {
        getExperimentID() {
            this.experimentID = window.location.href.split("/")[window.location.href.split("/").length - 1];
        },
        async getCurrentlyRunning() {
            let data = await dataRequest("/api/experiment/running/" + this.experimentID, "GET");
            this.warning = data.running;
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
        async getBacklogData() {
            let data = await dataRequest("/api/experiment/backlog/" + this.experimentID, "GET");
            this.backlogData = data;
        },
        async getTaskSequenceData() {
            let data = await dataRequest("/api/experiment/task-sequence/" + this.experimentID, "GET");
            this.taskSequenceData = data.filter(e => e.iteration_number == 0);
            this.formattedTaskSequenceData = this.formatTaskSequenceData(this.taskSequenceData);
            this.selectedOperation = 0;
        },
        async getAssetData() {
            let data = await dataRequest("/api/experiment/asset/" + this.experimentID, "GET");
            let secondIterationData = data.filter(e => e.iteration_number == 1);
            if (secondIterationData.length > 0) {
                this.assetData = secondIterationData;
                this.iteration = 1;
            } else {
                this.assetData = data;
            }
            // console.log(data);
            // console.log(this.assetData);
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
            let secondIterationData = data.filter(e => e.iteration_number == 1);
            if (secondIterationData.length > 0) {
                this.backupProcessTimeData = JSON.parse(JSON.stringify(secondIterationData));
                this.processTimeData = secondIterationData;
                this.iteration = 1;
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
            // console.log(data)
            this.jobListData = data;
        },
        async getCoreModelData() {
            let data = await dataRequest("/api/experiment/core/" + this.experimentID, "GET");
            this.coreUsage = data.map(e => e.available);
            let coreModelData = data.map(({ experiment_core_id, available, core, ...rest }) => {
                return {
                    experiment_core_id: experiment_core_id,
                    available: available,
                    core_model_id: core.core_model.core_model_id,
                    core_number: core.core_model.core_number,
                    model_number: core.core_model.model_number,
                    status: core.core_model.status,
                    created: core.core_model.created,
                    last_modified: core.core_model.last_modified
                }
            });
            this.coreModelData = coreModelData;
        },
        async getJobData() {
            let results = await Promise.allSettled([
                dataRequest("/api/experiment/job-core/" + this.experimentID, "GET"),
                dataRequest("/api/experiment/job-location/" + this.experimentID, "GET"),
                dataRequest("/api/experiment/arrival/distinct/" + this.experimentID, "GET"),
            ])
            this.jobData = results[0].value.map(e => {
                let jobLocationData = results[1].value.find(f => f.job_number == e.job_number);
                let arrivalData = results[2].value.find(f => f.job_number == e.job_number);
                let obj = { ...e };
                obj.model_number = arrivalData.model_number;
                obj.job_location_id = jobLocationData.job_location_id;
                obj.asset_id = jobLocationData.asset_id;
                obj.operation_name = jobLocationData.operation.display_name;
                return obj;
            })
            let assetOptions = this.assetData.map(e => {
                let obj = {
                    name: e.asset.display_name,
                    id: e.asset_id,
                    selected: false
                }
                return obj
            })
            let assetRows = this.jobData.map(e => {
                let assets = JSON.parse(JSON.stringify(assetOptions));
                let selectedAsset = assets.find(f => f.id == e.asset_id)
                if (selectedAsset) {
                    selectedAsset.selected = true;
                }
                return assets;
            })
            let coreRows = this.jobData.map(e => {
                let cores = this.coreModelData.filter(f => f.model_number == e.model_number);
                let coreSelection = []
                cores.forEach(core => {
                    let selection = {
                        name: core.core_number,
                        id: core.core_number,
                        selected: false
                    }
                    if (e.core_number == core.core_number) {
                        selection.selected = true;
                    }
                    coreSelection.push(selection);
                })
                return coreSelection;
            })
            this.jobDropdownData = {
                asset_id: {
                    allowNull: false,
                    values: assetRows
                },
                core_number: {
                    allowNull: true,
                    values: coreRows
                }
            }
        },
        async getData() {
            this.loading = true
            this.getExperimentID();
            await Promise.allSettled([
                this.getCoreModelData(),
                this.getHoursOfOperationData(),
                this.getOperationToLocationData(),
                this.getRoutingData(),
                this.getJobMixData(),
                this.getJobListData(),
                this.getAssetData(),
                this.getTaskSequenceData(),
                this.getProcessTimeData(),
                this.getExperimentData(),
                this.getSiteData(),
                this.getCurrentlyRunning()
            ])
            this.excludedAssets = this.assetData.filter(e => e.asset.capacity == 0).map(e => e.asset.asset_id);
            this.selectedOperationChange();
            if (this.experimentData.scenario.scenario_id == 8) {
                this.demandSettings.backlog = true;
                this.getBacklogData();
            }
            this.selectedSite = this.experimentData.experiment_site.site_id;
            const siteSelectionEl = document.querySelector('input[value="' + this.experimentData.experiment_site.site_id + '"]');
            siteSelectionEl.checked = true;
            await this.getJobData();
            this.loading = false;
        },
        downloadTemplate() {
            window.open('/api/experiment/backlog/template');
        },
        async saveAllChanges() {
            let data = {
                asset: this.assetData.map(e => {
                    let obj = {};
                    obj.asset_id = e.asset.asset_id;
                    obj.asset_name = e.asset.asset_name;
                    obj.display_name = e.asset.display_name;
                    obj.asset_id_PV = e.asset.asset_id_PV;
                    obj.asset_type = e.asset.asset_type;
                    obj.pos_x = e.asset.pos_x;
                    obj.pos_y = e.asset.pos_y;
                    obj.pos_z = e.asset.pos_z;
                    obj.dim_length_feet = e.asset.dim_length_feet;
                    obj.dim_width_feet = e.asset.dim_width_feet;
                    obj.dim_height_feet = e.asset.dim_height_feet;
                    if (this.excludedAssets.indexOf(e.asset.asset_id) !== -1) {
                        obj.capacity = 0;
                    } else {
                        if (e.asset.capacity == 0) {
                            obj.capacity = "RESET";
                        } else {
                            obj.capacity = e.asset.capacity;
                        }
                    }
                    return obj;
                }),
                process_time: this.processTimeData.map(e => {
                    let obj = {};
                    obj.asset_id = e.process_time.asset_id;
                    obj.operation_id = e.process_time.operation_id;
                    obj.process_time = e.process_time.process_time;
                    return obj;
                })
            }
            this.loading = true;
            let coreData = this.coreModelData.map(({ experiment_core_id, available, ...rest }) => { return { experiment_core_id, available } })
            await Promise.allSettled([
                dataRequest("/api/experiment/site/" + this.experimentID, "PUT", JSON.stringify({ site_id: this.selectedSite })),
                dataRequest("/api/experiment/core/bulk/" + this.experimentID, "PUT", JSON.stringify({ data: coreData })),
                dataRequest("/api/experiment/inputs/" + this.experimentID, "POST", JSON.stringify({ iteration: 1, targetIteration: this.iteration, data })),
                this.saveJobChanges()
            ])
        },
        async uploadBacklog() {
            this.loading = true;
            let backlogInput = document.getElementById("backlog-input");
            let jsonData = await csvJson.CSVtoJson(backlogInput.files[0]);
            let backlogData = jsonData.map(e => {
                let obj = {
                    experiment_id: this.experimentID,
                    job_number: parseInt(e["Job"].match(/([0-9]+)[A-Z]*/, "")[1]),
                    serial_number: e["SerialNumber"],
                    part_number: e["Part"],
                    model_number: parseInt(e["Model"].match(/[A-z]*([0-9]+)[A-z0-9]*/)[1]),
                    location: e["Location"],
                    start_date: e["StartDate"],
                    day_number: parseInt(e["Day"]),
                    week_number: parseInt(e["Week"]),
                    expedite: (e["Expedite"] == "TRUE" ? true : false),
                    job_type: e["Group"],
                };
                if (e["Last Labor"]) obj.last_labor = e["Last Labor"];
                if (e["AdhesiveDry"]) obj.adhesive_dry = e["AdhesiveDry"];
                if (e["Scheduled"]) obj.scheduled = (e["Scheduled"] == "TRUE" ? true : false);
                if (e["Promise"]) obj.promise_date = e["Promise"];
                if (e["Order"]) obj.order_number = parseInt(e["Order"]);
                if (e["Name"]) obj.customer_name = e["Name"];
                return obj;
            })
            let uniqueIDs = [];
            backlogData = backlogData.filter(e => {
                if (uniqueIDs.indexOf(e.job_number) == -1) {
                    uniqueIDs.push(e.job_number);
                    return true
                } else {
                    return false
                }
            })
            this.backlogData = await dataRequest("/api/experiment/backlog/bulk/" + this.experimentID, "POST", JSON.stringify({ data: backlogData }));
            // console.log(this.backlogData);
            await this.saveAllChanges();
            await dataRequest("/api/experiment/populate/from-backlog", "POST", JSON.stringify({ expId: this.experimentID, numReplications: 3 }));
            await this.getJobData();
            this.loading = false;
        },
        async populateFromUI() {
            let populateFromUIData = {
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
            await dataRequest("/api/experiment/populate/from-ui", "POST", JSON.stringify(populateFromUIData));
        },
        async saveJobChanges() {
            let promises = []
            if (Object.keys(this.jobCoreChanges).length > 0) {
                let jobCoreList = [];
                let keys = Object.keys(this.jobCoreChanges);
                keys.forEach(key => {
                    jobCoreList.push({ job_core_id: key, core_number: this.jobCoreChanges[key] })
                });
                promises.push(dataRequest("/api/experiment/job-core/bulk/" + this.experimentID, "PUT", JSON.stringify({ data: jobCoreList })));
            }
            if (Object.keys(this.jobLocationChanges).length > 0) {
                let jobLocationList = [];
                let keys = Object.keys(this.jobLocationChanges);
                keys.forEach(key => {
                    jobLocationList.push({ job_location_id: key, asset_id: this.jobLocationChanges[key] })
                });
                promises.push(dataRequest("/api/experiment/job-location/bulk/" + this.experimentID, "PUT", JSON.stringify({ data: jobLocationList })));
            }
            await Promise.allSettled(promises);
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
            if (this.experimentData.scenario.scenario_id == 8) {
                await dataRequest("/api/experiment/populate/jobs/" + this.experimentID, "POST")
            } else {
                await this.populateFromUI();
            }
            this.$router.push("/experiments/design/experiment-configuration/" + this.experimentID);
        },
        async clickNext() {
            await this.saveAllChanges();
            if (this.experimentData.scenario.scenario_id == 8) {
                await dataRequest("/api/experiment/populate/jobs/" + this.experimentID, "POST")
            } else {
                await this.populateFromUI();
            }
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
        processTimeDataChange(mode, { process_time, experiment_process_time_id, operation_id, asset_id }) {
            let processTime = parseFloat(process_time);
            let operationID = parseInt(operation_id);
            let assetID = parseInt(asset_id);
            let experimentProcessTimeID = experiment_process_time_id;
            // let experimentProcessTimeID = parseInt(experiment_process_time_id);
            if (mode == "add" && operation_id !== undefined && asset_id !== undefined) {
                if (!process_time) { processTime = 0 }
                let entryIds = this.processTimeData.filter(e => e.process_time.asset_id == assetID && e.process_time.operation_id == operationID).map(e => e.experiment_process_time_id);
                let backupTimes = this.backupProcessTimeData.filter(e => e.process_time.asset_id == assetID && e.process_time.operation_id == operationID).filter(e => entryIds.indexOf(e.experiment_process_time_id) == -1);
                if (backupTimes.length > 0) {
                    let entry = this.processTimeData[this.processTimeData.push(backupTimes[0]) - 1];
                    if (process_time) {
                        entry.process_time.process_time = processTime;
                    }
                } else {
                    let id = "new-" + Math.floor(Math.random() * 1000000);
                    this.processTimeData.push({
                        experiment_process_time_id: id,
                        process_time: {
                            process_time: processTime,
                            asset_id: asset_id,
                            operation_id: operation_id
                        }
                    })
                }
            } else if (mode == "remove" && experiment_process_time_id !== undefined) {
                this.processTimeData.splice(this.processTimeData.findIndex(e => e.experiment_process_time_id == experimentProcessTimeID), 1);
            } else if (mode == "change" && process_time !== undefined && experiment_process_time_id !== undefined) {
                let data = this.processTimeData.find(e => e.experiment_process_time_id == experimentProcessTimeID);
                // console.log(data);
                data.process_time.process_time = processTime;
            } else if (mode == "overwrite" && operation_id !== undefined && asset_id !== undefined) {
                let template = this.processTimeData.filter(e => e.process_time.operation_id == operationID && e.process_time.asset_id == assetID);
                let assetIds = this.operationToLocationData.filter(e => e.operation_to_location.operation_id == operationID).map(e => e.operation_to_location.asset_id);
                assetIds.splice(assetIds.indexOf(asset_id), 1);
                assetIds.forEach(id => {
                    this.processTimeData.filter(e => e.process_time.operation_id == operationID && e.process_time.asset_id == id).forEach(entry => {
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
            this.processTimeData = JSON.parse(JSON.stringify(this.backupProcessTimeData));
            this.processTimeElementChange();
            // this.changedProcessTimeData = [];
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
                if (this.selectedAssets.filter(f => this.excludedAssets.indexOf(f.asset_id) == -1).length > 1) {
                    this.excludedAssets.push(e.data.asset_id);
                } else {
                    e.target.checked = true;
                    window.alert("You must have at least one asset selected for each operation.");
                }
            }
        },
        coreAvailabilityChange(e) {
            this.coreUsage[e.index] = e.checked;
            this.coreModelData[e.index].available = e.checked;
        },
        operationMapSelectionChange(e) {
            console.log(e);
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
        handleJobSelectionChange({ data, column, value }) {
            if (value == "null") { value = null };
            if (column == "asset_id") {
                let jobLocationID = this.jobData.find(e => e.job_number == data.job_number).job_location_id;
                this.jobLocationChanges[jobLocationID] = value;
            } else if (column == "core_number") {
                let jobCoreID = this.jobData.find(e => e.job_number == data.job_number).job_core_id;
                this.jobCoreChanges[jobCoreID] = value;
            }
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

.limit-width {
    width: 60vw;
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