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
        <table>
            <thead>
                <tr>
                    <th v-for="key in headerData" @click="handleHeaderClick">{{ key }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in displayData">
                    <td v-for="item in row">{{ item }}</td>
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
            advancedSearchSelected: false
        }
    },
    name: 'SmartTable',
    props: ['jsonData', 'advancedSearchEnabled', 'excludedColumns', 'id'],
    methods: {
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
                        console.log(this.jsonData)
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
        }
    },
    watch: {
        jsonData: function (newVal, oldVal) {
            if (this.jsonData.length > 0 && this.jsonData[0] !== undefined) {
                this.headerData = Object.keys(this.jsonData[0]);
                this.displayData = [...this.jsonData]
                this.excludedColumns.forEach(column => {
                    let index = this.headerData.indexOf(column);
                    if (index !== -1) {
                        this.headerData.splice(index, 1);
                    }
                    this.displayData.forEach(data => {
                        delete data[column];
                    })
                })
            } else {
                this.headerData = [];
            }
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
    max-width: 40vw;
    max-height: 70vh;
    overflow-x: auto;
    overflow-y: auto;
    margin: 0 20px 20px 20px;
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
}
</style>