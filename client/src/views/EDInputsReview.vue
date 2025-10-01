<template>
    <WarningModal :display="warning">
        <p class="space">This experiment is current running. Input changes are not permitted. Please follow the link
            below
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
            <div class="card">
                <table class="grid-less flex-right">
                    <tr>
                        <th>Advanced Mode?*</th>
                        <td>
                            <label class="switch">
                                <input type="checkbox" name="advanced-mode-toggle" @input="handleAdvanceModeChange">
                                <span class="slider round"></span>
                            </label>
                        </td>
                    </tr>
                </table>
            </div>
            <h1>3. Inputs Definition & Review</h1>
            <div id="input-collapsables">
                <Collapsable @toggle-collapse="collapsableToggleChange" title="General Information" name="general-info"
                    next="phases-cells-operations" :reset="collapsableStatus['general-info']">
                    <h3>Start Date</h3>
                    <input type="date" :value="demandSettings.startDate" name="demand-start-date-input" class="space"
                        @input="e => demandSettings.startDate = e.target.value">
                    <h3>Site Selection</h3>
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
                <Collapsable @toggle-collapse="collapsableToggleChange" title="Production Process" :defaultOpen="true"
                    name="production-process-settings" :reset="collapsableStatus['production-process-settings']">
                    <Collapsable @toggle-collapse="collapsableToggleChange" title="Phases, Cells, & Operations"
                        name="phases-cells-operations" back="general-info" next="locations-processing-times"
                        :heading="3" :reset="collapsableStatus['phases-cells-operations']" tbd="true">
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
                        :reset="collapsableStatus['locations-processing-times']" :defaultOpen="true">
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
                                                class="checkbox" :checked="this.processTimeSettings.discrete"
                                                @input="changeDistributionType(true)">
                                            <span class="radio-checkmark"></span>
                                            Discrete
                                        </label>
                                        <label for="continuous-select" class="radio-container">
                                            <input id="continuous-select" type="radio" name="discrete-continuous"
                                                class="checkbox" :checked="!this.processTimeSettings.discrete"
                                                @input="changeDistributionType(false)">
                                            <span class="radio-checkmark"></span>
                                            Continuous
                                        </label>
                                    </div>
                                    <div v-if="!processTimeSettings.default">
                                        <div v-if="processTimeSettings.discrete">
                                            <div v-if="processTimeSettings.applyToAll">
                                                <div v-if="advancedMode">
                                                    <div>
                                                        <p v-for="asset in selectedAssets">{{ asset.display_name }}</p>
                                                        <VueMultiselect
                                                            v-model="this.processTimeSettings.selectedModels[selectedAssets[0].asset_id]"
                                                            :options="this.processTimeSettings.modelData"
                                                            :multiple="true" :close-on-select="false"
                                                            placeholder="Select at least one model"
                                                            @update:model-value="handleModelSelectChange(selectedAssets[0].asset_id)"
                                                            :preselect-first="true">
                                                            <template slot="selection"
                                                                slot-scope="{ values, search, isOpen }"><span
                                                                    class="multiselect__single" v-show="!isOpen">
                                                                    options
                                                                    selected</span></template>
                                                        </VueMultiselect>
                                                        <table class="grid-less">
                                                            <tr>
                                                                <th><i class="bi bi-hash"></i> Number of Samples*</th>
                                                                <td>
                                                                    <input type="number"
                                                                        :value="Object.keys(processTimeSettings.elements[selectedAssets[0].asset_id].values).length"
                                                                        class="small-number-input"
                                                                        :name="'samples-' + selectedAssets[0].asset_id"
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
                                                                            class="small-number-input" type="number"
                                                                            :value="value" :name="'times-' + key"
                                                                            @input="handleProcessTimeDataChange(key, $event)">
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div v-else>
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
                                                                            class="small-number-input" type="number"
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
                                                <div v-if="advancedMode">
                                                    <div v-for="(element, asset_id) in processTimeSettings.elements">
                                                        <p>{{ element.name }}</p>
                                                        <VueMultiselect
                                                            v-model="this.processTimeSettings.selectedModels[asset_id]"
                                                            :options="this.processTimeSettings.modelData"
                                                            :multiple="true" :close-on-select="false"
                                                            placeholder="Select at least one model"
                                                            @update:model-value="handleModelSelectChange(asset_id)"
                                                            :preselect-first="true">
                                                            <template slot="selection"
                                                                slot-scope="{ values, search, isOpen }"><span
                                                                    class="multiselect__single" v-show="!isOpen">
                                                                    options
                                                                    selected</span></template>
                                                        </VueMultiselect>
                                                        <table class="grid-less">
                                                            <tr>
                                                                <th><i class="bi bi-hash"></i> Number of Samples*</th>
                                                                <td>
                                                                    <input type="number"
                                                                        :value="Object.keys(element.values).length"
                                                                        class="small-number-input"
                                                                        :name="'samples-' + asset_id"
                                                                        @input="handleNumberOfSamplesChange(asset_id, this.processTimeSettings.selectedModels[asset_id], $event)">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th><i class="bi bi-clock-fill"></i> Enter Processing
                                                                    Times
                                                                    (minutes)*</th>
                                                                <td>
                                                                    <div class="flex-left">
                                                                        <input v-for="(value, key) in element.values"
                                                                            class="small-number-input" type="number"
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
                                                                        class="small-number-input"
                                                                        :name="'samples-' + asset_id"
                                                                        @input="handleNumberOfSamplesChange(asset_id, this.processTimeSettings.selectedModels[asset_id], $event)">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th><i class="bi bi-clock-fill"></i> Enter Processing
                                                                    Times
                                                                    (minutes)*</th>
                                                                <td>
                                                                    <div class="flex-left">
                                                                        <input v-for="(value, key) in element.values"
                                                                            class="small-number-input" type="number"
                                                                            :value="value" :name="'times-' + key"
                                                                            @input="handleProcessTimeDataChange(key, $event)">
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <!-- Continuous Mode Start -->
                                        <div v-else>
                                            <div v-if="processTimeSettings.applyToAll">
                                                <div v-if="advancedMode">
                                                    <div>
                                                        <p v-for="asset in selectedAssets">{{ asset.display_name }}</p>
                                                        <VueMultiselect
                                                            v-model="this.processTimeSettings.selectedModels[selectedAssets[0].asset_id]"
                                                            :options="this.processTimeSettings.modelData"
                                                            :multiple="true" :close-on-select="false"
                                                            placeholder="Select at least one model"
                                                            @update:model-value="handleModelSelectChange(selectedAssets[0].asset_id)"
                                                            :preselect-first="true">
                                                            <template slot="selection"
                                                                slot-scope="{ values, search, isOpen }"><span
                                                                    class="multiselect__single" v-show="!isOpen">
                                                                    options
                                                                    selected</span></template>
                                                        </VueMultiselect>
                                                        <table class="grid-less">
                                                            <tr>
                                                                <th><i class="bi bi-bar-chart-line-fill"></i>
                                                                    Distribution Type*</th>
                                                                <td>
                                                                    <select name="distribution-type-apply-all-advanced"
                                                                        id="distribution-type-apply-all-advanced"
                                                                        @change="continuousProcessTimeChange($event, 'distribution')">
                                                                        <option value="Lognormal"
                                                                            :selected="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution == 'Lognormal'">
                                                                            Lognormal
                                                                        </option>
                                                                        <option value="Normal"
                                                                            :selected="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution == 'Normal'">
                                                                            Normal</option>
                                                                        <option value="Beta"
                                                                            :selected="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution == 'Beta'">
                                                                            Beta</option>
                                                                        <option value="Triangular"
                                                                            :selected="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution == 'Triangular'">
                                                                            Triangular</option>
                                                                        <option value="Uniform"
                                                                            :selected="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution == 'Uniform'">
                                                                            Uniform</option>
                                                                        <option value="Exponential"
                                                                            :selected="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution == 'Exponential'">
                                                                            Exponential</option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr
                                                                v-if="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution !== 'Normal'">
                                                                <th><i class="bi bi-dash-lg"></i> Min (minutes)*</th>
                                                                <td>
                                                                    <input type="number"
                                                                        :value="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.min"
                                                                        class="small-number-input"
                                                                        @change="continuousProcessTimeChange($event, 'min')" />
                                                                </td>
                                                            </tr>
                                                            <tr
                                                                v-if="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution == 'Beta' || this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution == 'Triangular' || this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution == 'Uniform'">
                                                                <th><i class="bi bi-plus-lg"></i> Max (minutes)*</th>
                                                                <td>
                                                                    <input type="number"
                                                                        :value="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.max"
                                                                        class="small-number-input"
                                                                        @change="continuousProcessTimeChange($event, 'max')" />
                                                                </td>
                                                            </tr>
                                                            <tr
                                                                v-if="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution !== 'Uniform'">
                                                                <th>{{
                                                                    this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution
                                                                        ===
                                                                        'Lognormal' ||
                                                                        this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution
                                                                        ==
                                                                        'Normal' ? "Mu" : "" }}
                                                                    {{
                                                                        this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution
                                                                            ===
                                                                            'Beta' ? "p" : "" }}
                                                                    {{
                                                                        this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution
                                                                            ===
                                                                            'Triangular' ? "Median" : "" }}
                                                                    {{
                                                                        this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution
                                                                            ===
                                                                            'Exponential' ? "Lambda" : "" }}
                                                                </th>
                                                                <td>
                                                                    <input type="number" class="small-number-input"
                                                                        @change="continuousProcessTimeChange($event, 'param1')"
                                                                        :value="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.param1">
                                                                </td>
                                                            </tr>
                                                            <tr
                                                                v-if="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution === 'Lognormal' || this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution == 'Normal' || this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution == 'Beta'">
                                                                <th>
                                                                    {{
                                                                        this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution
                                                                            ===
                                                                            'Lognormal' ||
                                                                            this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution
                                                                            ==
                                                                            'Normal' ? "Sigma" : "" }}
                                                                    {{
                                                                        this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution
                                                                            ===
                                                                            'Beta' ? "q" : "" }}
                                                                </th>
                                                                <td>
                                                                    <input type="number" class="small-number-input"
                                                                        @change="continuousProcessTimeChange($event, 'param2')"
                                                                        :value="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.param2">
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div v-else>
                                                    <div>
                                                        <p v-for="asset in selectedAssets">{{ asset.display_name }}</p>
                                                        <table class="grid-less">
                                                            <tr>
                                                                <th><i class="bi bi-bar-chart-line-fill"></i>
                                                                    Distribution Type*</th>
                                                                <td>
                                                                    <select name="distribution-type-apply-all-advanced"
                                                                        id="distribution-type-apply-all-advanced"
                                                                        @change="continuousProcessTimeChange($event, 'distribution')">
                                                                        <option value="Lognormal"
                                                                            :selected="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution == 'Lognormal'">
                                                                            Lognormal
                                                                        </option>
                                                                        <option value="Normal"
                                                                            :selected="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution == 'Normal'">
                                                                            Normal</option>
                                                                        <option value="Beta"
                                                                            :selected="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution == 'Beta'">
                                                                            Beta</option>
                                                                        <option value="Triangular"
                                                                            :selected="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution == 'Triangular'">
                                                                            Triangular</option>
                                                                        <option value="Uniform"
                                                                            :selected="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution == 'Uniform'">
                                                                            Uniform</option>
                                                                        <option value="Exponential"
                                                                            :selected="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution == 'Exponential'">
                                                                            Exponential</option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr
                                                                v-if="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution !== 'Normal'">
                                                                <th><i class="bi bi-dash-lg"></i> Min (minutes)*</th>
                                                                <td>
                                                                    <input type="number"
                                                                        :value="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.min"
                                                                        class="small-number-input"
                                                                        @change="continuousProcessTimeChange($event, 'min')" />
                                                                </td>
                                                            </tr>
                                                            <tr
                                                                v-if="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution == 'Beta' || this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution == 'Triangular' || this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution == 'Uniform'">
                                                                <th><i class="bi bi-plus-lg"></i> Max (minutes)*</th>
                                                                <td>
                                                                    <input type="number"
                                                                        :value="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.max"
                                                                        class="small-number-input"
                                                                        @change="continuousProcessTimeChange($event, 'max')" />
                                                                </td>
                                                            </tr>
                                                            <tr
                                                                v-if="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution !== 'Uniform'">
                                                                <th>{{
                                                                    this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution
                                                                        ===
                                                                        'Lognormal' ||
                                                                        this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution
                                                                        ==
                                                                        'Normal' ? "Mu" : "" }}
                                                                    {{
                                                                        this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution
                                                                            ===
                                                                            'Beta' ? "p" : "" }}
                                                                    {{
                                                                        this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution
                                                                            ===
                                                                            'Triangular' ? "Median" : "" }}
                                                                    {{
                                                                        this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution
                                                                            ===
                                                                            'Exponential' ? "Lambda" : "" }}
                                                                </th>
                                                                <td>
                                                                    <input type="number" class="small-number-input"
                                                                        @change="continuousProcessTimeChange($event, 'param1')"
                                                                        :value="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.param1">
                                                                </td>
                                                            </tr>
                                                            <tr
                                                                v-if="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution === 'Lognormal' || this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution == 'Normal' || this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution == 'Beta'">
                                                                <th>
                                                                    {{
                                                                        this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution
                                                                            ===
                                                                            'Lognormal' ||
                                                                            this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution
                                                                            ==
                                                                            'Normal' ? "Sigma" : "" }}
                                                                    {{
                                                                        this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.distribution
                                                                            ===
                                                                            'Beta' ? "q" : "" }}
                                                                </th>
                                                                <td>
                                                                    <input type="number" class="small-number-input"
                                                                        @change="continuousProcessTimeChange($event, 'param2')"
                                                                        :value="this.processTimeSettings.continuousElements[this.selectedAssets[0].asset_id].values.param2">
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-else>
                                                <div v-if="advancedMode">
                                                    <div v-for="(element, asset_id) in processTimeSettings.elements">
                                                        <p>{{ element.name }}</p>
                                                        <VueMultiselect
                                                            v-model="this.processTimeSettings.selectedModels[asset_id]"
                                                            :options="this.processTimeSettings.modelData"
                                                            :multiple="true" :close-on-select="false"
                                                            placeholder="Select at least one model"
                                                            @update:model-value="handleModelSelectChange(asset_id)"
                                                            :preselect-first="true">
                                                            <template slot="selection"
                                                                slot-scope="{ values, search, isOpen }"><span
                                                                    class="multiselect__single" v-show="!isOpen">
                                                                    options
                                                                    selected</span></template>
                                                        </VueMultiselect>
                                                        <table class="grid-less">
                                                            <tr>
                                                                <th><i class="bi bi-bar-chart-line-fill"></i>
                                                                    Distribution Type*</th>
                                                                <td>
                                                                    <select name="distribution-type-apply-all-advanced"
                                                                        id="distribution-type-apply-all-advanced"
                                                                        @change="continuousProcessTimeChange($event, 'distribution', asset_id)">
                                                                        <option value="Lognormal"
                                                                            :selected="this.processTimeSettings.continuousElements[asset_id].values.distribution == 'Lognormal'">
                                                                            Lognormal
                                                                        </option>
                                                                        <option value="Normal"
                                                                            :selected="this.processTimeSettings.continuousElements[asset_id].values.distribution == 'Normal'">
                                                                            Normal</option>
                                                                        <option value="Beta"
                                                                            :selected="this.processTimeSettings.continuousElements[asset_id].values.distribution == 'Beta'">
                                                                            Beta</option>
                                                                        <option value="Triangular"
                                                                            :selected="this.processTimeSettings.continuousElements[asset_id].values.distribution == 'Triangular'">
                                                                            Triangular</option>
                                                                        <option value="Uniform"
                                                                            :selected="this.processTimeSettings.continuousElements[asset_id].values.distribution == 'Uniform'">
                                                                            Uniform</option>
                                                                        <option value="Exponential"
                                                                            :selected="this.processTimeSettings.continuousElements[asset_id].values.distribution == 'Exponential'">
                                                                            Exponential</option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr
                                                                v-if="this.processTimeSettings.continuousElements[asset_id].values.distribution !== 'Normal'">
                                                                <th><i class="bi bi-dash-lg"></i> Min (minutes)*</th>
                                                                <td>
                                                                    <input type="number"
                                                                        :value="this.processTimeSettings.continuousElements[asset_id].values.min"
                                                                        class="small-number-input"
                                                                        @change="continuousProcessTimeChange($event, 'min', asset_id)" />
                                                                </td>
                                                            </tr>
                                                            <tr
                                                                v-if="this.processTimeSettings.continuousElements[asset_id].values.distribution == 'Beta' || this.processTimeSettings.continuousElements[asset_id].values.distribution == 'Triangular' || this.processTimeSettings.continuousElements[asset_id].values.distribution == 'Uniform'">
                                                                <th><i class="bi bi-plus-lg"></i> Max (minutes)*</th>
                                                                <td>
                                                                    <input type="number"
                                                                        :value="this.processTimeSettings.continuousElements[asset_id].values.max"
                                                                        class="small-number-input"
                                                                        @change="continuousProcessTimeChange($event, 'max', asset_id)" />
                                                                </td>
                                                            </tr>
                                                            <tr
                                                                v-if="this.processTimeSettings.continuousElements[asset_id].values.distribution !== 'Uniform'">
                                                                <th>{{
                                                                    this.processTimeSettings.continuousElements[asset_id].values.distribution
                                                                        ===
                                                                        'Lognormal' ||
                                                                        this.processTimeSettings.continuousElements[asset_id].values.distribution
                                                                        ==
                                                                        'Normal' ? "Mu" : "" }}
                                                                    {{
                                                                        this.processTimeSettings.continuousElements[asset_id].values.distribution
                                                                            ===
                                                                            'Beta' ? "p" : "" }}
                                                                    {{
                                                                        this.processTimeSettings.continuousElements[asset_id].values.distribution
                                                                            ===
                                                                            'Triangular' ? "Median" : "" }}
                                                                    {{
                                                                        this.processTimeSettings.continuousElements[asset_id].values.distribution
                                                                            ===
                                                                            'Exponential' ? "Lambda" : "" }}
                                                                </th>
                                                                <td>
                                                                    <input type="number" class="small-number-input"
                                                                        @change="continuousProcessTimeChange($event, 'param1', asset_id)"
                                                                        :value="this.processTimeSettings.continuousElements[asset_id].values.param1">
                                                                </td>
                                                            </tr>
                                                            <tr
                                                                v-if="this.processTimeSettings.continuousElements[asset_id].values.distribution === 'Lognormal' || this.processTimeSettings.continuousElements[asset_id].values.distribution == 'Normal' || this.processTimeSettings.continuousElements[asset_id].values.distribution == 'Beta'">
                                                                <th>
                                                                    {{
                                                                        this.processTimeSettings.continuousElements[asset_id].values.distribution
                                                                            ===
                                                                            'Lognormal' ||
                                                                            this.processTimeSettings.continuousElements[asset_id].values.distribution
                                                                            ==
                                                                            'Normal' ? "Sigma" : "" }}
                                                                    {{
                                                                        this.processTimeSettings.continuousElements[asset_id].values.distribution
                                                                            ===
                                                                            'Beta' ? "q" : "" }}
                                                                </th>
                                                                <td>
                                                                    <input type="number" class="small-number-input"
                                                                        @change="continuousProcessTimeChange($event, 'param2', asset_id)"
                                                                        :value="this.processTimeSettings.continuousElements[asset_id].values.param2">
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
                                                                <th><i class="bi bi-bar-chart-line-fill"></i>
                                                                    Distribution Type*</th>
                                                                <td>
                                                                    <select name="distribution-type-apply-all-advanced"
                                                                        id="distribution-type-apply-all-advanced"
                                                                        @change="continuousProcessTimeChange($event, 'distribution', asset_id)">
                                                                        <option value="Lognormal"
                                                                            :selected="this.processTimeSettings.continuousElements[asset_id].values.distribution == 'Lognormal'">
                                                                            Lognormal
                                                                        </option>
                                                                        <option value="Normal"
                                                                            :selected="this.processTimeSettings.continuousElements[asset_id].values.distribution == 'Normal'">
                                                                            Normal</option>
                                                                        <option value="Beta"
                                                                            :selected="this.processTimeSettings.continuousElements[asset_id].values.distribution == 'Beta'">
                                                                            Beta</option>
                                                                        <option value="Triangular"
                                                                            :selected="this.processTimeSettings.continuousElements[asset_id].values.distribution == 'Triangular'">
                                                                            Triangular</option>
                                                                        <option value="Uniform"
                                                                            :selected="this.processTimeSettings.continuousElements[asset_id].values.distribution == 'Uniform'">
                                                                            Uniform</option>
                                                                        <option value="Exponential"
                                                                            :selected="this.processTimeSettings.continuousElements[asset_id].values.distribution == 'Exponential'">
                                                                            Exponential</option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr
                                                                v-if="this.processTimeSettings.continuousElements[asset_id].values.distribution !== 'Normal'">
                                                                <th><i class="bi bi-dash-lg"></i> Min (minutes)*</th>
                                                                <td>
                                                                    <input type="number"
                                                                        :value="this.processTimeSettings.continuousElements[asset_id].values.min"
                                                                        class="small-number-input"
                                                                        @change="continuousProcessTimeChange($event, 'min', asset_id)" />
                                                                </td>
                                                            </tr>
                                                            <tr
                                                                v-if="this.processTimeSettings.continuousElements[asset_id].values.distribution == 'Beta' || this.processTimeSettings.continuousElements[asset_id].values.distribution == 'Triangular' || this.processTimeSettings.continuousElements[asset_id].values.distribution == 'Uniform'">
                                                                <th><i class="bi bi-plus-lg"></i> Max (minutes)*</th>
                                                                <td>
                                                                    <input type="number"
                                                                        :value="this.processTimeSettings.continuousElements[asset_id].values.max"
                                                                        class="small-number-input"
                                                                        @change="continuousProcessTimeChange($event, 'max', asset_id)" />
                                                                </td>
                                                            </tr>
                                                            <tr
                                                                v-if="this.processTimeSettings.continuousElements[asset_id].values.distribution !== 'Uniform'">
                                                                <th>{{
                                                                    this.processTimeSettings.continuousElements[asset_id].values.distribution
                                                                        ===
                                                                        'Lognormal' ||
                                                                        this.processTimeSettings.continuousElements[asset_id].values.distribution
                                                                        ==
                                                                        'Normal' ? "Mu" : "" }}
                                                                    {{
                                                                        this.processTimeSettings.continuousElements[asset_id].values.distribution
                                                                            ===
                                                                            'Beta' ? "p" : "" }}
                                                                    {{
                                                                        this.processTimeSettings.continuousElements[asset_id].values.distribution
                                                                            ===
                                                                            'Triangular' ? "Median" : "" }}
                                                                    {{
                                                                        this.processTimeSettings.continuousElements[asset_id].values.distribution
                                                                            ===
                                                                            'Exponential' ? "Lambda" : "" }}
                                                                </th>
                                                                <td>
                                                                    <input type="number" class="small-number-input"
                                                                        @change="continuousProcessTimeChange($event, 'param1', asset_id)"
                                                                        :value="this.processTimeSettings.continuousElements[asset_id].values.param1">
                                                                </td>
                                                            </tr>
                                                            <tr
                                                                v-if="this.processTimeSettings.continuousElements[asset_id].values.distribution === 'Lognormal' || this.processTimeSettings.continuousElements[asset_id].values.distribution == 'Normal' || this.processTimeSettings.continuousElements[asset_id].values.distribution == 'Beta'">
                                                                <th>
                                                                    {{
                                                                        this.processTimeSettings.continuousElements[asset_id].values.distribution
                                                                            ===
                                                                            'Lognormal' ||
                                                                            this.processTimeSettings.continuousElements[asset_id].values.distribution
                                                                            ==
                                                                            'Normal' ? "Sigma" : "" }}
                                                                    {{
                                                                        this.processTimeSettings.continuousElements[asset_id].values.distribution
                                                                            ===
                                                                            'Beta' ? "q" : "" }}
                                                                </th>
                                                                <td>
                                                                    <input type="number" class="small-number-input"
                                                                        @change="continuousProcessTimeChange($event, 'param2', asset_id)"
                                                                        :value="this.processTimeSettings.continuousElements[asset_id].values.param2">
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </div>

                                            </div>
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
                                    <h4 class="uppercase">{{this.siteData.find(e => e.site_id ===
                                        this.selectedSite).site_name}}</h4>
                                    <p>{{this.siteData.find(e => e.site_id === this.selectedSite).address}}</p>
                                    <p>{{this.siteData.find(e => e.site_id === this.selectedSite).city + ", " +
                                        siteData.find(e => e.site_id === this.selectedSite).state + " " +
                                        siteData.find(e =>
                                            e.site_id === this.selectedSite).zip}}</p>
                                </div>
                            </div>
                            <div class="card-with-title">
                                <h4 class="card-title">Hours of Operation</h4>
                                <table class="grid-less">
                                    <tr>
                                        <th>Use Default?*</th>
                                        <td>
                                            <label class="switch">
                                                <input type="checkbox" name="hoo-default-input" checked
                                                    @change="e => this.defaultHOO = e.target.checked">
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
                                            <td>
                                                {{ days[parseInt(day.hours_of_operation.day_num)][0].toUpperCase() +
                                                    days[parseInt(day.hours_of_operation.day_num)].slice(1) }}
                                            </td>
                                            <td v-if="day.hours_of_operation.start_time">{{
                                                day.hours_of_operation.start_time }}</td>
                                            <td v-else>-</td>
                                            <td v-if="day.hours_of_operation.end_time">{{
                                                day.hours_of_operation.end_time }}
                                            </td>
                                            <td v-else>-</td>
                                            <td v-if="day.hours_of_operation.total_hours">{{
                                                day.hours_of_operation.total_hours }}</td>
                                            <td v-else>-</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-for="day in this.days" v-if="!this.defaultHOO">
                                <h2>{{ day[0].toUpperCase() + day.slice(1) }}</h2>
                                <table class="grid-less">
                                    <tr>
                                        <th>Opens {{ day[0].toUpperCase() + day.slice(1) }}?</th>
                                        <td>
                                            <label class="switch">
                                                <input :name="day + '-closes'" :id="day + '-closes'" type="checkbox"
                                                    :checked="this.closingData[day].opens"
                                                    @change="e => this.closingData[day].opens = e.target.checked" />
                                                <span class="slider round"></span>
                                            </label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Closes {{ day[0].toUpperCase() + day.slice(1) }}?</th>
                                        <td>
                                            <label class="switch">
                                                <input :name="day + '-closes'" :id="day + '-closes'" type="checkbox"
                                                    :checked="this.closingData[day].closes"
                                                    @change="e => this.closingData[day].closes = e.target.checked" />
                                                <span class="slider round"></span>
                                            </label>
                                        </td>
                                    </tr>
                                    <tr v-if="this.closingData[day].opens">
                                        <th><label :for="day + '-start'">Start:</label></th>
                                        <td><input :name="day + '-start'" :id="day + '-start'" type="time"
                                                :value="this.closingData[day].starts" step="3600"
                                                @change="timeChange($event, day, 'starts')" /></td>
                                    </tr>
                                    <tr v-if="this.closingData[day].opens && this.closingData[day].closes">
                                        <th><label :for="day + '-end'">End:</label></th>
                                        <td><input :name="day + '-end'" :id="day + '-end'" type="time"
                                                :value="this.closingData[day].ends" step="3600"
                                                @change="timeChange($event, day, 'ends')" /></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </Collapsable>
                    <Collapsable @toggle-collapse="collapsableToggleChange" title="Equipment/Machines"
                        name="equipment-machines" next="cores-tools" back="buildings" :heading="3"
                        :reset="collapsableStatus['equipment-machines']">
                        <select @change="e => this.downtimeSettings.selectedEquipment = e.target.value">
                            <option v-for="asset in assetData" :id="'equipment-select-option' + asset.asset.asset_id"
                                :value="asset.asset.asset_id">{{ asset.asset.display_name }}</option>
                        </select>
                        <div>
                            <h3 class="space">{{assetData.find(e => e.asset.asset_id ==
                                this.downtimeSettings.selectedEquipment).asset.display_name}}</h3>
                            <div v-if="advancedMode == false">
                                <label for="equipment-downtime-hours">Total Hour Equipment Will Be Down:</label>
                                <input type="number" name="equipment-downtime-hours" id="equipment-downtime-hours"
                                    @change="e => this.downtimeSettings.downtimeHours = e.target.value" />
                                <button class="space" @click="handleDowntimeSave">Save</button>
                                <div>
                                    <div v-for="(downtime, index) in savedDowntime">
                                        <table class="grid-less">
                                            <tr>
                                                <th>{{ downtime.display_name }}</th>
                                                <td>Start Date: {{ downtime.start_date }}</td>
                                                <td>End Date: {{ downtime.end_date }}</td>
                                                <td><button @click="e => savedDowntime.splice(index, 1)">Remove</button>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <label for="start-date-equipment-downtime">Downtime Start:</label>
                                <input type="datetime-local" name="start-date-equipment-downtime"
                                    id="start-date-equipment-downtime"
                                    @change="e => downtimeSettings.downtimeStart = e.target.value" />
                                <label for="end-date-equipment-downtime">Downtime End:</label>
                                <input type="datetime-local" name="end-date-equipment-downtime"
                                    id="end-date-equipment-downtime"
                                    @change="e => downtimeSettings.downtimeEnd = e.target.value" />
                                <button class="space" @click="handleDowntimeSave">Save</button>
                                <!-- <div v-if="savedDowntime.length > 0">
                                    <p v-for="downtime in savedDowntime.filter(e => e.asset_id == selectedEquipment)">{{
                                        downtime.startDate }}</p>
                                </div> -->
                                <div>
                                    <div v-for="(downtime, index) in savedDowntime">
                                        <table class="grid-less">
                                            <tr>
                                                <th>{{ downtime.display_name }}</th>
                                                <td>Start Date: {{ downtime.start_date }}</td>
                                                <td>End Date: {{ downtime.end_date }}</td>
                                                <td><button @click="e => savedDowntime.splice(index, 1)">Remove</button>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Collapsable>
                    <Collapsable @toggle-collapse="collapsableToggleChange" title="Cores & Tools" name="cores-tools"
                        next="materials" back="equipment-machines" :heading="3"
                        :reset="collapsableStatus['cores-tools']">
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
                    <Collapsable @toggle-collapse="collapsableToggleChange" title="Materials" name="materials"
                        next="labor" back="cores-tools" :heading="3" :reset="collapsableStatus['materials']" tbd="true">
                        TBD
                    </Collapsable>
                    <Collapsable @toggle-collapse="collapsableToggleChange" title="Labor" name="labor" next="routing"
                        back="materials" :heading="3" :reset="collapsableStatus['labor']" v-if="experimentData.scenario.scenario_id == 4">
                        <h3>Worker:</h3>
                        <select>
                            <option v-for="(worker) in this.workerData">{{ worker.name }}</option>
                        </select>
                        <h3>Shift:</h3>
                        <select>
                            <option v-for="(shift) in this.shiftData">{{ shift.begin + "-" + shift.end }}</option>
                        </select>
                        <h3>Skills:</h3>
                        <VueMultiselect v-model="this.selectedSkills" :options="this.assetNames" :multiple="true"
                            :close-on-select="false" placeholder="Select at least one model"
                            @update:model-value="handleModelSelectChange(asset_id)" :preselect-first="true">
                            <template slot="selection" slot-scope="{ values, search, isOpen }"><span
                                    class="multiselect__single" v-show="!isOpen">
                                    options
                                    selected</span></template>
                        </VueMultiselect>
                        <button class="space">Save</button>
                    </Collapsable>
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
                            <LayoutMaker mode="routing-map" :assetData="assetData" :routingData="routingData"
                                :selectedOperation="taskSequenceData[selectedOperation]"
                                @selection-change="operationMapSelectionChange" id="2" />
                        </div>
                    </div>
                    <div>
                        <Collapsable @toggle-collapse="collapsableToggleChange" title="Routing" name="routing"
                            back="labor" next="queuing" :reset="collapsableStatus['routing']" tbd="true">
                            <div v-if="routingData" class="limit-width">
                                <SmartTable :jsonData="routingDisplayData" :advancedSearchEnabled="false"
                                    :excludedColumns="['destinations']" :id="3" />
                            </div>
                        </Collapsable>
                        <Collapsable @toggle-collapse="collapsableToggleChange" title="Queuing" name="queuing"
                            back="routing" next="priority" :reset="collapsableStatus['queuing']" tbd="true">TBD
                        </Collapsable>
                        <Collapsable @toggle-collapse="collapsableToggleChange" title="Priority" name="priority"
                            back="queuing" next="transportation" :reset="collapsableStatus['priority']" v-if="experimentData.scenario.scenario_id == 4">
                            <div v-if="taskSequenceData" class="card">
                                <div>
                                    <button @click="clickPreviousOperation"><i class="bi bi-arrow-left"></i></button>
                                    <button @click="clickNextOperation"><i class="bi bi-arrow-right"></i></button>
                                </div>
                                <h4>Current</h4>
                                <p>{{ this.taskSequenceData[this.selectedOperation].task_sequence.phase.display_name
                                }} | {{
                                        this.taskSequenceData[this.selectedOperation].task_sequence.cell.display_name }}
                                    | {{
                                        this.taskSequenceData[this.selectedOperation].task_sequence.operation.display_name
                                    }}
                                </p>
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
                            <div v-if="this.priorityData.find(e => e.operation_id == this.selectedOperation)">
                                <h3>Static Priority?</h3>
                                <label class="switch">
                                    <input type="checkbox" name="static-priority-toggle"
                                        :checked="this.priorityData.find(e => e.operation_id == this.selectedOperation).static_priority"
                                        @input="e => this.priorityData.find(e => e.operation_id == this.selectedOperation).static_priority = e.target.checked">
                                    <span class="slider round"></span>
                                </label>
                                <div
                                    v-if="this.priorityData.find(e => e.operation_id == this.selectedOperation).static_priority">
                                    <h4>Priority Value</h4>
                                    <input type="number"
                                        :value="this.priorityData.find(e => e.operation_id == this.selectedOperation).priority" />
                                </div>
                                <div v-else>
                                    <h4>Dynamic Priority</h4>
                                    <table class="grid-less">
                                        <tr>
                                            <thead>
                                                <label for="priority-max-tubes">Max Tubes:</label>
                                            </thead>
                                            <td>
                                                <input id="priority-max-tubes" name="priority-max-tubes"
                                                    type="number" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <thead>
                                                <label for="priority-max-priority">Max Priority:</label>
                                            </thead>
                                            <td>
                                                <input id="priority-max-priority" name="priority-max-priority"
                                                    type="number" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <thead>
                                                <label for="priority-n-growth">N Growth:</label>
                                            </thead>
                                            <td>
                                                <input id="priority-n-growth" name="priority-n-growth" type="number" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <thead>
                                                <label for="priority-time-growth">Time Growth:</label>
                                            </thead>
                                            <td>
                                                <input id="priority-time-growth" name="priority-time-growth"
                                                    type="number" />
                                            </td>
                                        </tr>
                                    </table>               
                                </div>
                                <button class="space">Save</button>
                            </div>
                            <div v-else>
                                <h3>This Operation Does Not Support Priority At This Time</h3>
                            </div>
                        </Collapsable>
                    </div>
                </Collapsable>
                <Collapsable @toggle-collapse="collapsableToggleChange" title="Transportation" name="transportation"
                    back="priority" next="demand" :reset="collapsableStatus['transportation']" tbd="true">TBD
                </Collapsable>
                <Collapsable @toggle-collapse="collapsableToggleChange" title="Demand" name="demand"
                    back="transportation" next="review" :reset="collapsableStatus['demand']">
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
                                <h4>Daily Target</h4>
                                <table class="grid-less">
                                    <tr>
                                        <th>Min</th>
                                        <td>
                                            <input type="number" class="small-number-input" step="1" min="0"
                                                name="demand-target-min-input" :value="demandSettings.dailyTarget.min"
                                                @input="e => this.demandSettings.dailyTarget.min = parseInt(e.target.value)"
                                                @blur="handleDailyTargetMinBlur">
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Max</th>
                                        <td>
                                            <input type="number" class="small-number-input" step="1" min="1"
                                                name="demand-target-max-input" :value="demandSettings.dailyTarget.max"
                                                @input="e => this.demandSettings.dailyTarget.max = parseInt(e.target.value)"
                                                @blur="handleDailyTargetMaxBlur">
                                        </td>
                                    </tr>
                                </table>
                                <h4>Job Mix (%)</h4>
                                <table class="grid-less">
                                    <tr v-for="({ job_mix }) in jobMixData">
                                        <th>{{ job_mix.display_name }}</th>
                                        <td><input type="number" class="small-number-input" step="1"
                                                @input="handleJobMixChange(job_mix.job_mix_id, $event)"
                                                :name="'demand-mix-' + job_mix.job_type + '-input'"
                                                :value="job_mix.percent" min="0" max="100"></td>
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
                            <div v-if="this.backlogData" class="space">
                                This experiment has Backlog Data. If you would like to overwrite, upload new backlog
                                data
                                below and click "Upload".
                            </div>
                            <h4>Start Date</h4>
                            <input type="date" :value="demandSettings.startDate" name="backlog-start-date-input"
                                class="space" @input="e => demandSettings.startDate = e.target.value">
                            <div>
                                <label for="backlog-input">Upload Backlog</label>
                                <input type="file" name="backlog-input" id="backlog-input" class="space" accept=".csv">
                            </div>
                            <div class="flex-right">
                                <button @click="uploadBacklog">Upload</button>
                            </div>
                            <div v-if="jobData && jobDropdownData" class="limit-width">
                                <SmartTable :jsonData="jobData" :advancedSearchEnabled="false" :id="4"
                                    :excludedColumns="['job_location_id', 'job_core_id']"
                                    :dropdownData="jobDropdownData" @selection-change="handleJobSelectionChange" />
                            </div>
                        </div>
                    </div>
                </Collapsable>
                <Collapsable @toggle-collapse="collapsableToggleChange" title="Review" name="review" back="demand"
                    :reset="collapsableStatus['review']" tbd="true">TBD</Collapsable>
            </div>
            <div class="flex-right space"><button @click="clickBack">Back</button><button
                    @click="clickNext">Next</button>
            </div>
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
import VueMultiselect from 'vue-multiselect';
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
            routingDisplayData: null,
            priorityData: null,
            selectedPriority: 1,
            jobMixData: null,
            jobData: null,
            downtimeData: null,
            coreModelData: null,
            shiftData: null,
            workerData: null,
            jobListData: null,
            selectedOperation: 2,
            selectedAssets: null,
            jobDropdownData: null,
            assetNames: null,
            selectedSkills: null,
            hoursOfOperationData: null,
            continuousProcessTimeData: null,
            backupContinuousProcessTimeData: null,
            processTimeTypeData: null,
            backupProcessTimeTypeData: null,
            backlogData: null,
            warning: false,
            loading: false,
            advancedMode: false,
            downtimeSettings: {
                downtimeStart: null,
                downtimeEnd: null,
                downtimeHours: null,
                selectedEquipment: 1
            },
            savedDowntime: [],
            jobLocationChanges: {},
            jobCoreChanges: {},
            processTimeSettings: {
                default: true,
                applyToAll: true,
                discrete: true,
                assets: {},
                elements: {},
                continuousElements: {},
                modelData: [],
                selectedModels: {},
                distributionType: "Lognormal"
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
                startDate: dayjs().format('YYYY-MM-DD').toString(),
                uploadedBacklog: false
            },
            processTimeData: null,
            backupProcessTimeData: null,
            changedProcessTimeData: [],
            excludedAssets: [],
            selectedAssetInclusion: null,
            coreUsage: [],
            collapsableStatus: {},
            days: [
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday"
            ],
            closingData: {
                monday: { opens: true, closes: false, starts: "00:00", ends: null },
                tuesday: { opens: true, closes: false, starts: "00:00", ends: null },
                wednesday: { opens: true, closes: false, starts: "00:00", ends: null },
                thursday: { opens: true, closes: false, starts: "00:00", ends: null },
                friday: { opens: true, closes: false, starts: "00:00", ends: null },
                saturday: { opens: true, closes: false, starts: "00:00", ends: null },
                sunday: { opens: true, closes: false, starts: "00:00", ends: null },
            },
            defaultHOO: true,
            operationList: [],
        }
    },
    mixins: [titleMixin],
    title: 'Experiment Designer',
    components: { Sidebar, Header, ExperimentDesignerSidebar, ExperimentDesignerSidebar, LayoutMaker, SmartTable, Collapsable, LoadingModal, WarningModal, VueMultiselect },
    methods: {
        getExperimentID() {
            this.experimentID = window.location.href.split("/")[window.location.href.split("/").length - 1];
        },
        async getCurrentlyRunning() {
            let data = await dataRequest("/api/experiment/simulation/status/" + this.experimentID, "GET");
            if (data.status == "RUNNING") {
                this.warning = true;
            }
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
            // console.log(this.formattedTaskSequenceData);
            this.selectedOperation = 2;
        },
        async getPriorityData() {
            let data = await dataRequest("/api/experiment/priority", "GET");
            console.log(data);
            this.priorityData = data.map(priority => {
                return priority.priority;
            });
        },
        async getAssetData() {
            let data = await dataRequest("/api/experiment/asset/with-op-to-loc/" + this.experimentID, "GET");
            let secondIterationData = data.filter(e => e.iteration_number == 1);
            if (secondIterationData.length > 0) {
                this.assetData = secondIterationData;
                this.iteration = 1;
            } else {
                this.assetData = data;
            }
            this.assetNames = this.assetData.map(e => e.asset.display_name);
            // console.log(data);
            // console.log(this.assetData);
        },
        async getOperationToLocationData() {
            let data = await dataRequest("/api/experiment/operation-to-location/" + this.experimentID, "GET");
            console.log(data);
            this.operationToLocationData = data;
        },
        async getHoursOfOperationData() {
            let data = await dataRequest("/api/experiment/hours-of-operation/" + this.experimentID, "GET");
            // console.log(data);
            this.hoursOfOperationData = data;
            for (let i = 0; i < 7; i++) {
                // console.log(data.find(e => e.hours_of_operation.day_num == i));
                if (data.find(e => e.hours_of_operation.day_num == i).hours_of_operation.start_time !== null) {
                    this.closingData[this.days[i]].opens = true;
                    this.closingData[this.days[i]].starts = data.find(e => e.hours_of_operation.day_num == i).hours_of_operation.start_time
                } else {
                    this.closingData[this.days[i]].opens = false;
                    this.closingData[this.days[i]].starts = null;
                }
                if (data.find(e => e.hours_of_operation.day_num == i).hours_of_operation.end_time !== null) {
                    this.closingData[this.days[i]].closes = true;
                    this.closingData[this.days[i]].ends = data.find(e => e.hours_of_operation.day_num == i).hours_of_operation.end_time;
                } else {
                    this.closingData[this.days[i]].closes = false;
                    this.closingData[this.days[i]].ends = null;
                }
            }
            // console.log(this.closingData);
        },
        async getWorkerData() {
            let data = await dataRequest("/api/worker", "GET");
            console.log(data);
            this.workerData = data;
        },
        async getProcessTimeData() {
            let data = await dataRequest("/api/experiment/process-time/" + this.experimentID, "GET");
            // console.log(data);
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
        async getContinuousProcessTimeData() {
            let data = await dataRequest("/api/experiment/continuous-process-time/" + this.experimentID, "GET");
            // console.log(data);
            if (data.find(e => e.iteration_number == 1)) {
                this.backupContinuousProcessTimeData = data.filter(e => e.iteration_number == 1);
                this.continuousProcessTimeData = data.filter(e => e.iteration_number == 1);
            } else {
                this.backupContinuousProcessTimeData = data;
                this.continuousProcessTimeData = data;
            }
        },
        async getProcessTimeTypeData() {
            let data = await dataRequest("/api/experiment/process-time-type/" + this.experimentID, "GET");
            // console.log(data);
            if (data.find(e => e.iteration_number == 1)) {
                this.backupProcessTimeTypeData = data.filter(e => e.iteration_number == 1);
                this.processTimeTypeData = data.filter(e => e.iteration_number == 1);
            } else {
                this.backupProcessTimeTypeData = data;
                this.processTimeTypeData = data;
            }
        },
        async getShiftData() {
            let data = await dataRequest("/api/shift", "GET");
            console.log(data);
            this.shiftData = data;
        },
        async getRoutingData() {
            let data = await dataRequest("/api/experiment/routing/" + this.experimentID, "GET");
            this.routingData = data;
            this.routingDisplayData = data.map(e => {
                let f = e.routing;
                let obj = f;
                obj.origin_asset = f.origin_asset.display_name;
                obj.destination_asset = f.destination_asset.display_name;
                return obj;
            });
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
        async getModelData() {
            let data = await dataRequest("/api/model/", "GET");
            data = data.map(e => e.model_number);
            // console.log(data);
            this.processTimeSettings.modelData = data;
        },
        async getDowntimeData() {
            let data = await dataRequest("/api/experiment/downtime/" + this.experimentID, "GET");
            // console.log(data);
            this.downtimeData = data;
        },
        async getCoreModelData() {
            let data = await dataRequest("/api/experiment/core/" + this.experimentID, "GET");
            this.coreUsage = data.map(e => e.available);
            console.log(data);
            let coreModelData = data.map(({ experiment_core_id, available, core, ...rest }) => {
                // console.log(experiment_core_id);
                // console.log(available);
                // console.log(core.core_model.core_model_id);
                // console.log(core.core_model.core_number);
                // console.log(core.core_model.model_number);
                // console.log(core.core_model.status);
                // console.log(core.core_model.created);
                // console.log(core.core_model.last_modified);
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
            console.log("B");
            console.log(this.coreModelData);
            console.log("C");
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
                let assets = JSON.parse(JSON.stringify(assetOptions)).filter(e => e.name !== "With Customer");
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
                this.getContinuousProcessTimeData(),
                this.getPriorityData(),
                this.getProcessTimeTypeData(),
                this.getExperimentData(),
                this.getSiteData(),
                this.getCurrentlyRunning(),
                this.getModelData(),
                this.getDowntimeData(),
                this.getShiftData(),
                this.getWorkerData(),
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
            this.downtimeData.forEach(downtime => {
                // console.log(downtime);
                let d = downtime.asset_downtime;
                let startTime = dayjs().set('hour', d.start_time.split(':')[0]).set('minute', d.start_time.split(':')[1]).set('second', d.start_time.split(':')[2]);
                let endTime = dayjs().set('hour', d.end_time.split(':')[0]).set('minute', d.end_time.split(':')[1]).set('second', d.end_time.split(':')[2]);
                this.savedDowntime.push({
                    start_date: dayjs(this.demandSettings.startDate).set('hour', 0).set('minute', 0).add(d.day_num, 'day').set('hour', startTime.hour()).set('minute', startTime.minute()).format("YYYY-MM-DDTHH:MM").toString(),
                    end_date: dayjs(this.demandSettings.startDate).set('hour', 0).set('minute', 0).add(d.day_num, 'day').set('hour', endTime.hour()).set('minute', endTime.minute()).format("YYYY-MM-DDTHH:MM").toString(),
                    display_name: this.assetData.find(e => e.asset_id == d.asset_id).asset.display_name,
                    asset_id: d.asset_id,
                })
            })
            this.loading = false;
        },
        downloadTemplate() {
            window.open('/api/experiment/backlog/template');
        },
        async saveAllChanges() {
            this.loading = true;
            let downtime = [];
            this.savedDowntime.forEach(entry => {
                let startDate = dayjs(entry.start_date);
                let endDate = dayjs(entry.end_date);
                if (startDate.date() == endDate.date()) {
                    downtime.push({
                        day_num: startDate.day(),
                        start_time: startDate.format('HH:MM:ss').toString(),
                        end_time: endDate.format('HH:MM:ss').toString(),
                        asset_id: entry.asset_id
                    })
                } else {
                    let downtimeCheck = true;
                    let currentDay = startDate.day();
                    while (downtimeCheck) {
                        if (currentDay == startDate.day()) {
                            downtime.push({
                                day_num: currentDay,
                                start_time: startDate.format('HH:MM:ss').toString(),
                                end_time: '23:59:59',
                                asset_id: entry.asset_id
                            })
                        } else if (currentDay == endDate.day()) {
                            downtime.push({
                                day_num: currentDay,
                                start_time: '00:00:00',
                                end_time: endDate.format('HH:MM:ss').toString(),
                                asset_id: entry.asset_id
                            })
                            downtimeCheck = false;
                        } else {
                            downtime.push({
                                day_num: currentDay,
                                start_time: '00:00:00',
                                end_time: '23:59:59',
                                asset_id: entry.asset_id
                            })
                        }
                        if (currentDay == 6) {
                            currentDay = 0;
                        } else {
                            currentDay++;
                        }
                    }
                }
            })
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
                    obj.model_number = e.process_time.model_number;
                    return obj;
                }),
                downtime: downtime
            }
            console.log(this.coreModelData);
            let coreData = this.coreModelData.map(({ experiment_core_id, available, ...rest }) => { return { experiment_core_id, available } })
            // console.log(coreData);
            let hooData = [];
            for (let i = 0; i < 7; i++) {
                let start_time;
                let end_time;
                let total_hours;
                if (!this.closingData[this.days[i]].opens) {
                    start_time = null;
                    end_time = null;
                    total_hours = 0;
                } else if (!this.closingData[this.days[i]].closes) {
                    start_time = this.closingData[this.days[i]].starts.split(":")[0] + ":00:00";
                    end_time = null;
                    total_hours = 24 - parseInt(this.closingData[this.days[i]].starts.split(":")[0]);
                } else {
                    start_time = this.closingData[this.days[i]].starts.split(":")[0] + ":00:00";
                    end_time = this.closingData[this.days[i]].ends.split(":")[0] + ":00:00";
                    total_hours = parseInt(this.closingData[this.days[i]].ends.split(":")[0]) - parseInt(this.closingData[this.days[i]].starts.split(":")[0])
                }
                hooData.push({
                    site_id: 1,
                    day_num: i,
                    start_time: start_time,
                    end_time: end_time,
                    total_hours: total_hours
                })
            }
            await Promise.allSettled([
                dataRequest("/api/experiment/site/" + this.experimentID, "PUT", JSON.stringify({ site_id: this.selectedSite })),
                dataRequest("/api/experiment/core/bulk/" + this.experimentID, "PUT", JSON.stringify({ data: coreData })),
                dataRequest("/api/experiment/inputs/" + this.experimentID, "POST", JSON.stringify({ iteration: 1, targetIteration: this.iteration, data })),
                dataRequest("/api/experiment/hours-of-operation/update/" + this.experimentID, "PUT", JSON.stringify(hooData)),
                dataRequest("/api/experiment/process-time-type/" + this.experimentID, "PUT", JSON.stringify(this.processTimeTypeData)),
                dataRequest("/api/experiment/continuous-process-time/" + this.experimentID, "PUT", JSON.stringify(this.continuousProcessTimeData)),
                this.saveJobChanges()
            ])
        },
        async uploadBacklog() {
            this.loading = true;
            let backlogInput = document.getElementById("backlog-input");
            let jsonData = await csvJson.CSVtoJson(backlogInput.files[0]);
            // console.log(jsonData);
            let backlogData = jsonData.map(e => {
                console.log(e);
                let obj = {
                    experiment_id: this.experimentID,
                    job_number: parseInt(e["Job"].match(/([0-9]+)[A-Z]*/, "")[1]),
                    serial_number: e["SerialNumber"],
                    part_number: e["Part"],
                    model_number: parseInt(e["Model"].replace("T", "7")),
                    location: e["Location"],
                    start_date: this.demandSettings.startDate,
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
            let duplicateIDs = [];
            backlogData = backlogData.filter(e => {
                if (uniqueIDs.indexOf(e.job_number) == -1) {
                    uniqueIDs.push(e.job_number);
                    return true
                } else {
                    duplicateIDs.push(e.job_number);
                    return false
                }
            })
            let backlogStatus = await dataRequest("/api/experiment/backlog/bulk/" + this.experimentID, "POST", JSON.stringify({ data: backlogData }), { statusOnly: true });
            if (backlogStatus.status == 200) {
                await this.getBacklogData();
                await this.saveAllChanges();
                await dataRequest("/api/experiment/populate/from-backlog", "POST", JSON.stringify({ expId: this.experimentID, numReplications: 3 }));
                await this.getJobData();
            } else {
                window.alert('Backlog validation error. Please review file and try again. Expected format available to download under "Download Template"')
            }
            this.demandSettings.uploadedBacklog = true;
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
            for (let i = 0; i < data.length - 1; i++) {
                // console.log(formattedData);
                // console.log(currentID);
                // console.log(data.find(e => e.task_sequence.operation_id == currentID));
                let sequenceItem = data.find(e => e.task_sequence.operation_id == currentID).task_sequence;
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
                currentID = sequenceItem.next_operation;
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
            if (this.experimentData.scenario.scenario_id == 8 && this.demandSettings.uploadedBacklog == false) {
                window.alert("Please Upload a Backlog File");
            } else {
                await this.saveAllChanges();
                if (this.experimentData.scenario.scenario_id == 8) {
                    await dataRequest("/api/experiment/populate/jobs/" + this.experimentID, "POST")
                } else {
                    await this.populateFromUI();
                }
                this.$router.push("/experiments/design/experiment-parameters/" + this.experimentID);
            }
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
            // console.log(this.formattedTaskSequenceData);
            let operationIndex = -1;
            let selectedExperimentAssets = [];
            while (selectedExperimentAssets.length == 0 && operationIndex < 10) {
                operationIndex = operationIndex + 1;
                // console.log(operationIndex);
                selectedExperimentAssets = validExperimentAssets.filter(item => {
                    if (item.asset.operation_to_locations[operationIndex] && item.asset.operation_to_locations[operationIndex].operation_id == this.taskSequenceData[this.selectedOperation].task_sequence.operation_id) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }
            if (selectedExperimentAssets.length > 0) {
                let selectedAssets = selectedExperimentAssets.map(item => item.asset);
                this.selectedAssets = selectedAssets.map(({ operation_to_locations, ...rest }) => rest);
                this.selectedAssetInclusion = this.selectedAssets.map(e => this.excludedAssets.indexOf(e.asset_id) == -1);
                this.processTimeSettings.selectedModels = {};
                let modelIndex = -1;
                while (this.processTimeData.filter(e => e.process_time.model_number == this.processTimeSettings.modelData[modelIndex]).length == 0 && modelIndex < 300) {
                    modelIndex = modelIndex + 1;
                }
                // let assetsCovered = 0;
                // while (assetsCovered !== this.assetData.length && modelIndex < 300) {
                //     assetsCovered = 0;
                //     modelIndex = modelIndex + 1;
                //     console.log(this.processTimeSettings.modelData[modelIndex]);
                //     this.assetData.forEach(asset => {
                //         if (this.processTimeData.filter(e => e.process_time.model_number == this.processTimeSettings.modelData[modelIndex] && e.process_time.asset_id == asset.asset_id).length > 0) {
                //             assetsCovered = assetsCovered + 1
                //         }
                //     })
                //     console.log(assetsCovered + " " + this.assetData.length);
                // }
                this.selectedAssets.forEach(asset => {
                    this.processTimeSettings.selectedModels[asset.asset_id] = [this.processTimeSettings.modelData[modelIndex]];
                });
            } else {
                this.selectedAssets = [{ Status: "No Associated Assets" }];
            }
            if (this.processTimeTypeData.find(e => e.operation_id == this.taskSequenceData[this.selectedOperation].task_sequence.operation_id).discrete == 1) {
                this.processTimeSettings.discrete = true;
            } else {
                this.processTimeSettings.discrete = false;
            }
            this.processTimeElementChange();
        },
        applyToAllChange(e) {
            this.processTimeSettings.applyToAll = e.target.checked;
            this.processTimeElementChange();
        },
        processTimeElementChange() {
            this.processTimeSettings.elements = {};
            this.processTimeSettings.continuousElements = {};
            this.selectedAssets.forEach(asset => {
                let processTimes = this.processTimeData.filter(e => e.process_time.asset_id == asset.asset_id && e.process_time.model_number == this.processTimeSettings.selectedModels[asset.asset_id][0]);
                this.processTimeSettings.elements[asset.asset_id] = {
                    name: asset.display_name,
                    values: {}
                }
                processTimes.forEach(e => {
                    this.processTimeSettings.elements[asset.asset_id].values[e.experiment_process_time_id] = e.process_time.process_time;
                })
                let exampleModel = this.continuousProcessTimeData.find(e => e.process_time_distribution.asset_id == asset.asset_id && e.process_time_distribution.model_number == this.processTimeSettings.selectedModels[asset.asset_id][0]);
                // console.log(exampleModel);
                if (!exampleModel) {
                    exampleModel = {
                        process_time_distribution: {
                            distriburion: "lognormal",
                            min: 0,
                            max: 0,
                            param1: 0,
                            param2: 0
                        },

                    }
                }
                this.processTimeSettings.continuousElements[asset.asset_id] = {
                    name: asset.display_name,
                    values: {
                        distribution: exampleModel.process_time_distribution.distribution,
                        min: exampleModel.process_time_distribution.min,
                        max: exampleModel.process_time_distribution.max,
                        param1: exampleModel.process_time_distribution.param1,
                        param2: exampleModel.process_time_distribution.param2
                    }
                }
            })
            // console.log(this.processTimeSettings.elements[this.selectedAssets[0].asset_id].values);
            // console.log(this.processTimeSettings.elements[this.selectedAssets[0].asset_id]);
        },
        handleAdvanceModeChange(e) {
            this.advancedMode = e.target.checked;
            if (e.target.checked) {
                this.processTimeElementChange();
                Object.keys(this.processTimeSettings.selectedModels).forEach(key => {
                    this.processTimeSettings.selectedModels[key] = this.processTimeSettings.modelData;
                })
            } else {
                this.processTimeElementChange();
            }
        },
        handleModelSelectChange(asset_id) {
            if (this.processTimeSettings.selectedModels[asset_id].length == 1) {
                this.processTimeElementChange();
            };
        },
        processTimeDataChange(mode, { process_time, model_number, experiment_process_time_id, operation_id, asset_id }) {
            let processTime = parseFloat(process_time);
            let operationID = parseInt(operation_id);
            let assetID = parseInt(asset_id);
            let experimentProcessTimeID = experiment_process_time_id;
            let modelNumber = parseInt(model_number);
            // let experimentProcessTimeID = parseInt(experiment_process_time_id);
            if (mode == "add" && operation_id !== undefined && asset_id !== undefined) {
                if (!process_time) { processTime = 0 }
                let entryIds = this.processTimeData.filter(e => e.process_time.asset_id == assetID && e.process_time.operation_id == operationID && e.process_time.model_number == modelNumber).map(e => e.experiment_process_time_id);
                let backupTimes = this.backupProcessTimeData.filter(e => e.process_time.asset_id == assetID && e.process_time.operation_id == operationID && e.process_time.model_number == modelNumber).filter(e => entryIds.indexOf(e.experiment_process_time_id) == -1);
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
                            operation_id: operation_id,
                            model_number: modelNumber
                        }
                    });
                }
            } else if (mode == "remove" && experiment_process_time_id !== undefined) {
                this.processTimeData.splice(this.processTimeData.findIndex(e => e.experiment_process_time_id == experimentProcessTimeID), 1);
            } else if (mode == "change" && process_time !== undefined && experiment_process_time_id !== undefined) {
                let data = this.processTimeData.find(e => e.experiment_process_time_id == experimentProcessTimeID);
                // console.log(data);
                data.process_time.process_time = processTime;
            } else if (mode == "overwrite" && operation_id !== undefined && asset_id !== undefined && model_number !== undefined) {
                let template = this.processTimeData.filter(e => e.process_time.operation_id == operationID && e.process_time.asset_id == assetID && e.process_time.model_number == modelNumber);
                let assetIds = this.operationToLocationData.filter(e => e.operation_to_location.operation_id == operationID).map(e => e.operation_to_location.asset_id);
                assetIds.splice(assetIds.indexOf(asset_id), 1);
                assetIds.forEach(id => {
                    this.processTimeSettings.selectedModels[id].forEach(modelNum => {
                        this.processTimeData.filter(e => e.process_time.operation_id == operationID && e.process_time.asset_id == id && e.process_time.model_number == modelNum).forEach(entry => {
                            this.processTimeDataChange("remove", { experiment_process_time_id: entry.experiment_process_time_id });
                        })
                        template.forEach(entry => {
                            this.processTimeDataChange("add", { model_number: modelNum, operation_id: operation_id, asset_id: id, process_time: entry.process_time.process_time });
                        })
                    })
                })
            } else {
                throw new Error('Incorrect Inputs Provided: ' + operation_id + " " + asset_id + " " + experiment_process_time_id + " " + process_time);
            }
        },
        continuousProcessTimeDataChange() {

        },
        handleNumberOfSamplesChange(asset_id, model_number, { target }) {
            // console.log(this.processTimeSettings.elements);
            let selectedOperation = this.taskSequenceData[this.selectedOperation];
            let samples = parseInt(target.value);
            let keys = Object.keys(this.processTimeSettings.elements[asset_id].values);
            if (samples > keys.length) {
                for (let i = keys.length; i < samples; i++) {
                    this.processTimeDataChange("add", { model_number: model_number, operation_id: selectedOperation.task_sequence.operation_id, asset_id: asset_id });
                }
            } else if (samples < keys.length) {
                let stop = keys.length;
                for (let i = samples; i < stop; i++) {
                    this.processTimeDataChange("remove", { experiment_process_time_id: keys[i] });
                }
            }
            if (this.processTimeSettings.applyToAll) {
                this.processTimeDataChange("overwrite", { model_number: model_number, operation_id: selectedOperation.task_sequence.operation_id, asset_id: asset_id });
            }
            this.processTimeElementChange();
        },
        handleProcessTimeDataChange(id, e) {
            if (e.data !== '.') {
                let selectedOperation = this.taskSequenceData[this.selectedOperation];
                let data = this.processTimeData.find(f => f.experiment_process_time_id == id);
                this.processTimeDataChange("change", { experiment_process_time_id: id, process_time: e.target.value });
                if (this.processTimeSettings.applyToAll) {
                    this.processTimeDataChange("overwrite", { model_number: data.process_time.model_number, operation_id: selectedOperation.task_sequence.operation_id, asset_id: data.process_time.asset_id })
                }
                this.processTimeElementChange();
            }
        },
        resetProcessingTimeChanges() {
            this.processTimeData = JSON.parse(JSON.stringify(this.backupProcessTimeData));
            this.processTimeElementChange();
            this.continuousProcessTimeData = JSON.parse(JSON.stringify(this.backupContinuousProcessTimeData));
            this.processTimeTypeData = JSON.parse(JSON.stringify(this.backupProcessTimeTypeData));
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
        handleDailyTargetMinBlur() {
            if (this.demandSettings.dailyTarget.min > this.demandSettings.dailyTarget.max) {
                this.demandSettings.dailyTarget.max = this.demandSettings.dailyTarget.min;
            }
        },
        handleDailyTargetMaxBlur() {
            if (this.demandSettings.dailyTarget.max < this.demandSettings.dailyTarget.min) {
                this.demandSettings.dailyTarget.min = this.demandSettings.dailyTarget.max;
            }
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
        },
        handleDowntimeSave(event) {
            let asset = this.assetData.find(e => e.asset.asset_id == this.downtimeSettings.selectedEquipment);
            if (this.advancedMode) {
                // let startDate = this.document.getElementById("start-date-equipment-downtime");
                // let endDate = this.document.getElementById("end-date-equipment-downtime");

                this.savedDowntime.push({
                    display_name: asset.asset.display_name,
                    start_date: this.downtimeSettings.downtimeStart,
                    end_date: this.downtimeSettings.downtimeEnd,
                    asset_id: asset.asset.asset_id
                })
            } else {
                this.savedDowntime.push({
                    display_name: asset.asset.display_name,
                    start_date: dayjs(this.demandSettings.startDate).set('hour', 0).set('minute', 0).format("YYYY-MM-DDTHH:MM").toString(),
                    end_date: dayjs(this.demandSettings.startDate).set('hour', 0).set('minute', 0).add(parseInt(this.downtimeSettings.downtimeHours), 'hour').format("YYYY-MM-DDTHH:MM").toString(),
                    asset_id: asset.asset.asset_id
                })
            }
        },
        timeChange(e, day, type) {
            e.target.value = e.target.value.split(":")[0] + ":00:00"
            this.closingData[day][type] = e.target.value;
            if (type == 'ends') {
                if (parseInt(this.closingData[day].starts.split(":")[0]) > parseInt(this.closingData[day].ends.split(":")[0])) {
                    e.target.value = this.closingData[day].starts;
                    this.closingData[day].ends = this.closingData[day].starts;
                }
            }
        },
        changeDistributionType(discrete) {
            this.processTimeSettings.discrete = discrete
            let assets = this.processTimeTypeData.filter(e => e.operation_id == this.taskSequenceData[this.selectedOperation].task_sequence.operation_id);
            if (discrete) {
                assets.forEach(e => e.discrete = 1);
            } else {
                assets.forEach(e => e.discrete = 0);
            }
        },
        continuousProcessTimeChange(e, type, asset_id) {
            if (!asset_id) {
                asset_id = this.selectedAssets[0].asset_id;
            }
            this.processTimeSettings.continuousElements[asset_id].values[type] = e.target.value;
            let processTimes;
            if (!this.advancedMode) {
                if (this.processTimeSettings.applyToAll) {
                    processTimes = this.continuousProcessTimeData.filter(f => {
                        let assetIDS = []
                        this.selectedAssets.forEach(g => assetIDS.push(g.asset_id))
                        if (assetIDS.includes(f.process_time_distribution.asset_id)) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                } else {
                    processTimes = this.continuousProcessTimeData.filter(f => f.process_time_distribution.asset_id == asset_id);
                }
            } else {
                if (this.processTimeSettings.applyToAll) {
                    processTimes = this.continuousProcessTimeData.filter(f => {
                        let assetIDS = []
                        this.selectedAssets.forEach(g => assetIDS.push(g.asset_id))
                        if (assetIDS.includes(f.process_time_distribution.asset_id) && this.processTimeSettings.selectedModels[this.selectedAssets[0].asset_id].includes(f.process_time_distribution.model_number)) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                } else {
                    processTimes = this.continuousProcessTimeData.filter(f => f.process_time_distribution.asset_id == asset_id && this.processTimeSettings.selectedModels[asset_id].includes(f.process_time_distribution.model_number));
                }
            }
            console.log(processTimes);
            console.log(e.target.value);
            for (let i = 0; i < processTimes.length; i++) {
                processTimes[i].process_time_distribution[type] = e.target.value;
            }
        }
    },
    mounted() {
        this.createCollapsableObject();
        this.getData();
    }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

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