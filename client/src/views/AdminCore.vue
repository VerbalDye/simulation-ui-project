<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <AdminSidebar />
        <div class="content">
            <h1>Core Management</h1>
            <div>
                <div>
                    <h2>Add Core</h2>
                    <table class="full-table">
                        <tr>
                            <th>Core Number</th>
                            <th>Model Number</th>
                            <th>Oven Drawer Position</th>
                            <th>Oven Number</th>
                            <th>Oven Temperature (f)</th>
                            <th>Soak Time (minutes)</th>
                            <th>Status</th>
                        </tr>
                        <tr>
                            <td><input type="number" /></td>
                            <td><input type="number" /></td>
                            <td><select>
                                    <option value="1F" selected>1F</option>
                                    <option value="2F">2F</option>
                                </select></td>
                            <td><input type="number" /></td>
                            <td><input type="number" /></td>
                            <td><input type="number" /></td>
                            <td><select>
                                    <option value="R&D" selected>R&D</option>
                                    <option value="APPROVED">APPROVED</option>
                                    <option value="SCRAP">SCRAP</option>
                                    <option value="QUARANTINE">QUARANTINE</option>
                                    <option value="REPAIR">REPAIR</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                    <option value="DEVELOP">DEVELOP</option>
                                    <option value="SOLD">SOLD</option>
                                </select></td>
                        </tr>
                    </table>
                    <button class="space">Add Core</button>
                </div>
                <div>
                    <h2>Edit Cores</h2>
                    <label for="core-search" class="space">Search: </label>
                    <input name="core-search" id="core-search" type="text" @change="coreSearchChange($event)" />
                    <table class="full-table">
                        <tr>
                            <th>Core Number</th>
                            <th>Model Number</th>
                            <th>Oven Drawer Position</th>
                            <th>Oven Number</th>
                            <th>Oven Temperature (f)</th>
                            <th>Soak Time (minutes)</th>
                            <th>Status</th>
                            <th>Delete?</th>
                        </tr>
                        <tr v-for="entry in shownTableData">
                            <td>{{ entry.core_number }}</td>
                            <td>{{ entry.model_number }}</td>
                            <td><select>
                                    <option value="1F" :selected="entry.core_oven_drawer_position == '1F'">1F</option>
                                    <option value="2F" :selected="entry.core_oven_drawer_position == '2F'">2F</option>
                                </select></td>
                            <td>{{ entry.core_oven_number }}</td>
                            <td><input type="number" :value="entry.soak_temperature_f" /></td>
                            <td><input type="number" :value="entry.time_minutes" /></td>
                            <td><select>
                                    <option value="R&D" :selected="entry.status == 'R&D'">R&D</option>
                                    <option value="APPROVED" :selected="entry.status == 'APPROVED'">APPROVED</option>
                                    <option value="SCRAP" :selected="entry.status == 'SCRAP'">SCRAP</option>
                                    <option value="QUARANTINE" :selected="entry.status == 'QUARANTINE'">QUARANTINE
                                    </option>
                                    <option value="REPAIR" :selected="entry.status == 'REPAIR'">REPAIR</option>
                                    <option value="CANCELLED" :selected="entry.status == 'CANCELLED'">CANCELLED</option>
                                    <option value="DEVELOP" :selected="entry.status == 'DEVELOP'">DEVELOP</option>
                                    <option value="SOLD" :selected="entry.status == 'SOLD'">SOLD</option>
                                </select></td>
                            <td><button @click="deleteRow(entry.core_number)">Delete</button></td>
                        </tr>
                    </table>
                    <div>
                        Showing {{ page + 1 }} - {{ page + pageCount > filteredTableData.length ?
                            filteredTableData.length :
                        page + pageCount }} of {{ filteredTableData.length }}
                    </div>
                    <button @click="changePage('skip-back')"><i class="bi bi-chevron-double-left"></i></button>
                    <button @click="changePage('back')"><i class="bi bi-chevron-left"></i></button>
                    <button @click="changePage('forward')"><i class="bi bi-chevron-right"></i></button>
                    <button @click="changePage('skip-forward')"><i class="bi bi-chevron-double-right"></i></button>
                    <br />
                    <button @click="saveChanges" class="space">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import SmartTable from '@/components/SmartTable.vue';
import AdminSidebar from '@/components/AdminSidebar.vue';
import titleMixin from '../mixins/titleMixin';
import dataRequest from '@/utils/dataRequest';
export default {
    data() {
        return {
            links: null,
            coreModelData: {},
            filteredTableData: [],
            tableData: [],
            shownTableData: [],
            page: 0,
            pageCount: 50,
        }
    },
    components: { AdminSidebar, Header, Sidebar, SmartTable },
    mixins: [titleMixin],
    title: 'Core Management',
    methods: {
        async getCoreModelData() {
            let data = await dataRequest("/api/core-model/soak-time", "GET")
            console.log(data);
            data.forEach(entry => {
                this.tableData.push({
                    core_number: entry.core_number,
                    model_number: entry.model_number,
                    core_oven_drawer_position: entry.core.core_soak_times[0].core_oven_drawer_position,
                    core_oven_number: entry.core.core_soak_times[0].core_oven_number,
                    soak_temperature_f: entry.core.core_soak_times[0].soak_temperature_f,
                    time_minutes: entry.core.core_soak_times[0].time_minutes,
                    status: entry.status
                })
            })
            console.log(this.tableData);
            this.filteredTableData = JSON.parse(JSON.stringify(this.tableData));
            this.shownTableData = this.filteredTableData.slice(0, this.pageCount - 1);
            this.coreModelData = data;
        },
        changePage(type) {
            if (type == "skip-back") {
                this.page = 0
            } else if (type == "back") {
                if (this.page - this.pageCount >= 0) {
                    this.page = this.page - this.pageCount
                }
            } else if (type == "forward") {
                if (this.page + this.pageCount <= this.filteredTableData.length) {
                    this.page = this.page + this.pageCount
                }
            } else if (type == "skip-forward") {
                this.page = Math.floor(this.filteredTableData.length / this.pageCount) * this.pageCount
            }
            this.shownTableData = this.filteredTableData.slice(this.page, this.page + this.pageCount - 1);
        },
        coreSearchChange(e) {
            this.filteredTableData = JSON.parse(JSON.stringify(this.tableData.filter(f => {
                let searchString = f.core_number.toString() + f.model_number + f.core_oven_drawer_position + f.core_oven_number + f.soak_temperature_f + f.time_minutes + f.status;
                if (searchString.includes(e.target.value)) {
                    return true;
                } else {
                    return false;
                }
            })));
            this.changePage('reload');
        },
        deleteRow(core_number) {
            this.tableData = this.tableData.filter(e => e.core_number !== core_number);
            this.filteredTableData = this.filteredTableData.filter(e => e.core_number !== core_number);
            this.changePage('reload');
        },
        saveChanges() {

        }
    },
    mounted() {
        this.locationSearch = window.location.search;
        this.getCoreModelData();
    }
}
</script>
