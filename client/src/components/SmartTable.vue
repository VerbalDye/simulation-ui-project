<!-- // Need to deal with ID propagation -->
<template>
    <div v-if="this.advancedSearchSelected">
        <div v-for="key in headerData" class="advanced-search-containers">
            <label :for="key + '-search'">{{ key }}:</label>
            <input class="advanced-search-input" :name="key + '-search'" :id="key + '-search'"
                @input="handleAdvancedSearchChange">
        </div>
        <button @click="handleCloseAdvancedSearch">Standard Search</button>
    </div>
    <div v-else class="table-controls">
        <label :for="'smart-table-search-' + this.id">Search</label>
        <input type="text" :id="'smart-table-search-' + this.id" name="search" @input="handleSearchChange">
        <button v-if="this.advancedSearchEnabled" @click="handleOpenAdvancedSearch">Advanced Search</button>
    </div>
    <div class="table-container">
        <table v-if="jsonData">
            <thead>
                <tr>
                    <th v-if="toggle">{{ toggle }}</th>
                    <th v-for="key in headerData" @click="handleHeaderClick">
                        <div v-if="columnHeadings">{{ columnHeadings[key] }}</div>
                        <div v-else>{{ key }}</div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, index) in displayData">
                    <td v-if="toggle"><input type="checkbox" :checked="toggleData[index]"
                            :class="'smart-table-' + id + '-toggle-input'" @input="handleToggleChange(row, index, $event)"
                            :name="'toggle-' + index"></td>
                    <td v-for="(item, key) in row">
                        <select v-if="dropdownData && dropdownData[key]" @change="handleDropdownChange(row, key, $event)" :name="key+'-'+index">
                            <option
                                v-if="dropdownData[key].allowNull || !dropdownData[key].values[index].find(e => e.selected == true)"
                                :disabled="!dropdownData[key].allowNull"
                                :selected="!dropdownData[key].values[index].find(e => e.selected == true)" value="null">
                            </option>
                            <option v-for="option in dropdownData[key].values[index]" :value="option.id"
                                :selected="option.selected">{{ option.name }}</option>
                        </select>
                        <router-link v-else-if="links" :to="links[index]">{{ item }}</router-link>
                        <div v-else>{{ item }}</div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            headerData: [],
            displayData: [],
            headerNameClicked: null,
            advancedSearchSelected: false,
            selectedIndices: [],
            excluded: []
        }
    },
    name: 'SmartTable',
    props: ['jsonData', 'advancedSearchEnabled', 'excludedColumns', 'id', 'toggle', 'toggleData', 'links', 'columnHeadings', 'dropdownData'],
    emits: ['toggle-change', 'selection-change'],
    methods: {
        handleToggleChange(row, index, { target }) {
            this.$emit('toggle-change', { checked: target.checked, data: row, index: index, target: target });
        },
        handleDropdownChange(row, column, event) {
            // console.log(event.target.value);
            this.$emit('selection-change', { data: row, column: column, value: event.target.value });
        },
        handleSearchChange() {
            let searchVal = document.getElementById("smart-table-search-" + this.id).value;
            this.displayData = [];
            this.jsonData.forEach(item => {
                let include = false;
                Object.values(item).forEach(entry => {
                    if (entry !== null) {
                        if (entry.toString().toLowerCase().includes(searchVal.toLowerCase())) {
                            include = true;
                        }
                    }
                })
                if (include) {
                    this.displayData.push(item);
                }
            })
        },
        handleAdvancedSearchChange() {
            this.displayData = [...this.jsonData];
            document.querySelectorAll(".advanced-search-input").forEach(searchElement => {
                let queryTerm = searchElement.value;
                this.displayData.forEach((item, index) => {
                    if (!item[searchElement.id.split("-search")[0]].toString().toLowerCase().includes(queryTerm.toLowerCase())) {
                        delete this.displayData[index];
                    }
                })
            })
        },
        handleHeaderClick(event) {
            if (this.headerNameClicked !== event.target.innerText) {
                this.headerNameClicked = event.target.innerText;
                this.displayData.sort(this.sorter);
            } else {
                this.displayData.reverse();
            }
        },
        handleOpenAdvancedSearch() {
            document.getElementById("search").value = "";
            this.handleSearchChange();
            this.advancedSearchSelected = true;
        },
        handleCloseAdvancedSearch() {
            document.querySelectorAll(".advanced-search-input").forEach(item => {
                item.value = ""
            });
            this.handleAdvancedSearchChange();
            this.advancedSearchSelected = false;
        },
        sorter(a, b) {
            let aText = a[this.headerNameClicked].toString().toLowerCase();
            let bText = b[this.headerNameClicked].toString().toLowerCase();
            if (aText < bText) {
                return -1;
            }
            if (aText > bText) {
                return 1;
            }
            return 0;
        },
        dataSetup() {
            if (this.jsonData && this.jsonData.length > 0 && this.jsonData[0] !== undefined) {
                this.headerData = Object.keys(this.jsonData[0]);
                this.displayData = JSON.parse(JSON.stringify(this.jsonData));
                this.excluded.forEach(column => {
                    let index = this.headerData.indexOf(column);
                    if (index !== -1) {
                        this.headerData.splice(index, 1);
                        this.displayData.forEach(entry => {
                            delete entry[column];
                        })
                    }
                })
            } else {
                this.headerData = [];
            }
        }
    },
    mounted() {
        if (this.excludedColumns) {
            this.excluded = this.excluded.concat(this.excludedColumns);
        }
        this.dataSetup();
    },
    watch: {
        jsonData: function (newVal, oldVal) {
            this.dataSetup();
        },
        toggleData: function (newVal, oldVal) {
            let toggleInputs = Array.from(document.querySelectorAll('.smart-table-' + this.id + '-toggle-input'));
            toggleInputs.forEach((input, index) => {
                if (newVal.length > index) {
                    input.checked = newVal[index]
                }
            })
        }
    }
}
</script>

<style>
.table-container thead {
    position: sticky;
    top: 0;
    background-color: var(--secondary-blue);
    color: var(--white);
    text-align: center;
    font-weight: normal;
}

.table-container th {
    border-bottom: var(--black) 2px solid;
    padding: 10px 10px;
    text-align: left;
    cursor: pointer;
}

.table-container td {
    border-bottom: var(--black) 1px solid;
    padding: 5px 10px;
    background-color: var(--white);
}

.table-container {
    max-height: 70vh;
    overflow-x: auto;
    overflow-y: auto;
    margin: 0 20px 20px 20px;
}

.table-container a {
    color: var(--black);
    text-decoration: none;
}

.table-controls {
    margin: 20px 20px 5px 20px;
}

.advanced-search-containers {
    display: inline;
}

.advanced-search-containers input {
    display: inline;
    margin: 3px 5px 3px 0;
}</style>