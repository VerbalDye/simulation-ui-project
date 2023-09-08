<template>
    <LoadingModal :display="loading" />
    <Header />
    <div class="site-container">
        <Sidebar />
        <ExperimentDesignerSidebar currentPage="0" />
        <div class="content">
            <h1>1. Scenario Selection</h1>
            <div class="flex-between">
                <div id="search-and-select">
                    <i class="bi bi-search"></i><input type="text" id="scenario-search">
                    <div>
                        <h2>Scenarios</h2>
                        <form id="scenario-selection" @change="formatFilter">
                            <div v-for="scenario in scenarioData" class="scenario-container filtered-in">
                                <input type="radio" :id="scenario.scenario_id" name="scenario-selection"
                                    :value="scenario.experiment_id">
                                <label :for="scenario.scenario_id">{{ scenario.scenario_name }}</label>
                            </div>
                        </form>
                    </div>
                </div>
                <div>
                    <div class="filters">
                        <h2><i class="bi bi-sliders"></i>Filters</h2>
                        <button @click="clearFilters">Clear</button>
                        <div>
                            <h3>Analysis Type</h3>
                            <button id="non-optimization-filter"
                                @click="setFilterValue('analysis_type', 'non-optimization')">Non-Optimization</button>
                            <button id="optimization-filter"
                                @click="setFilterValue('analysis_type', 'optimization')">Optimization</button>
                        </div>
                        <div>
                            <h3>Experiment Type</h3>
                            <button id="operational-filter"
                                @click="setFilterValue('experiment_type', 'operational')">Operational</button>
                            <button id="tactical-filter"
                                @click="setFilterValue('experiment_type', 'tactical')">Tactical</button>
                            <button id="strategic-filter"
                                @click="setFilterValue('experiment_type', 'strategic')">Strategic</button>
                        </div>
                        <div>
                            <h3>Department</h3>
                            <button id="manufacturing-filter"
                                @click="setFilterValue('department', 'manufacturing')">Manufacturing</button>
                            <button id="engineering-filter"
                                @click="setFilterValue('department', 'engineering')">Engineering</button>
                            <button id="maintenance-filter"
                                @click="setFilterValue('department', 'maintenance')">Maintenance</button>
                            <button id="quality-filter" @click="setFilterValue('department', 'quality')">Quality</button>
                            <button id="supply_chain-filter" @click="setFilterValue('department', 'supply_chain')">Supply
                                Chain</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-right"><button @click="clickNext">Next</button></div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import titleMixin from '../mixins/titleMixin';
import Sidebar from '@/components/Sidebar.vue';
import ExperimentDesignerSidebar from '@/components/ExperimentDesignerSidebar.vue';
import LoadingModal from '@/components/LoadingModal.vue';
import dataRequest from '@/utils/dataRequest';
export default {
    data() {
        return {
            scenarioData: [],
            filterSettings: {
                analysis_type: [],
                experiment_type: [],
                department: []
            },
            loading: false
        }
    },
    mixins: [titleMixin],
    title: 'Experiment Designer',
    components: { Sidebar, Header, ExperimentDesignerSidebar, ExperimentDesignerSidebar, LoadingModal },
    methods: {
        async getScenarioData() {
            let data = await dataRequest("/api/scenario/", "GET");
            this.scenarioData = data;
        },
        scenarioShowing(scenario) {
            let f = this.filterSettings;
            let filters = [...scenario.scenario_filters]
            if (f.analysis_type.length == 0 && f.experiment_type.length == 0 && f.department.length == 0) {
                return true;
            }
            filters = filters.filter(item => !f.analysis_type.length || f.analysis_type.includes(item.analysis_type.replace(" ", "_").toLowerCase()))
            filters = filters.filter(item => !f.experiment_type.length || f.experiment_type.includes(item.experiment_type.replace(" ", "_").toLowerCase()))
            filters = filters.filter(item => !f.department.length || f.department.includes(item.department.replace(" ", "_").toLowerCase()))
            console.log(filters);
            if (filters.length > 0) {
                return true;
            }
            return false;
        },
        setFilterValue(filterType, value) {
            let type = this.filterSettings[filterType];
            let index = type.indexOf(value)
            if (index == -1) {
                type.push(value);
            } else {
                type.splice(index, 1);
            }
            this.formatFilter();
        },
        formatFilter() {
            let scenarioEls = document.querySelectorAll('.scenario-container');
            let selectedBtns = document.querySelectorAll('.selected');
            selectedBtns.forEach(btn => {
                btn.classList.remove('selected');
            });
            for (const property in this.filterSettings) {
                let filter = this.filterSettings[property];
                if (filter.length > 0) {
                    filter.forEach(type => {
                        let filterBtn = document.getElementById(type + "-filter");
                        filterBtn.classList.add('selected');
                    });
                }
            }
            this.scenarioData.sort((a, b) => this.scenarioShowing(b) - this.scenarioShowing(a));
            // scenarioEls.forEach(element => {
            //     element.classList.remove('checked');
            //     element.classList.remove('filtered-in');
            //     if (element.children[0].checked) {
            //         element.classList.add('checked');
            //     } else if (this.scenarioShowing(this.scenarioData.find(e => e.scenario_id == element.children[0].id))) {
            //         element.classList.add('filtered-in');
            //     }
            // });
            let count = 0
            this.scenarioData.forEach(scenario => {
                if (!this.scenarioShowing(scenario)) {
                    count++;
                }
            });
            scenarioEls.forEach((element, index) => {
                console.log(scenarioEls.length, count);
                element.classList.remove('checked');
                element.classList.remove('filtered-in');
                if (element.children[0].checked) {
                    element.classList.add('checked');
                } else if (index < scenarioEls.length - count) {
                    element.classList.add('filtered-in');
                }
            });
        },
        clearFilters() {
            this.filterSettings.analysis_type = [];
            this.filterSettings.department = [];
            this.filterSettings.experiment_type = [];
            this.formatFilter();
        },
        async clickNext() {
            const scenarioSelectionEl = document.querySelector('input[name="scenario-selection"]:checked');
            if (scenarioSelectionEl) {
                this.loading = true;
                let data = await dataRequest("/api/experiment/from/" + scenarioSelectionEl.value, "POST");
                this.$router.push("/experiments/design/experiment-configuration/" + data.experiment_id);
            }
        }
    },
    mounted() {
        this.getScenarioData();
        this.formatFilter();
    }
}
</script>

<style>
.content h1 {
    text-align: left;
}

#scenario-selection .scenario-container {
    border: 2px solid var(--tertiary-blue);
    color: var(--tertiary-blue);
    background-color: var(--white);
    border-radius: 16px;
    margin: 5px;
    display: table;
}

#scenario-selection input {
    display: none;
}

#scenario-selection label {
    padding: 10px;
    display: block;
    margin: 0;
}

#scenario-selection .checked {
    background-color: var(--tertiary-blue);
    color: var(--white);
}

#scenario-selection .filtered-in {
    background-color: var(--secondary-blue);
    color: var(--white);
    border: 2px solid var(--secondary-blue);
}

.filters {
    border: solid 1px var(--black);
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.3);
    padding: 10px;
}

.filters h2 {
    text-align: center;
}

.filters h2 i {
    margin-right: 3px;
}

.filters button {
    display: block;
    margin: 3px;
    background: none;
    color: var(--black);
}

.filters button:active {
    background-color: rgba(0, 0, 0, 0.3);
}

.filters .selected {
    background: var(--tertiary-blue);
    color: var(--white);
    font-weight: bold;
}
</style>