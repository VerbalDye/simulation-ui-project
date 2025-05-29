<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <AdminSidebar />
        <div class="content">
            <h1>Core Management</h1>
            <div>
                <label for="core-search">Search: </label>
                <input name="core-search" id="core-search" type="text" @change="coreSearchChange($event)"/>
                <SmartTable :jsonData="tableData"></SmartTable>
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
            tableData: []
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
                    core_oven_drawer_position: entry.core.core_soak_times.core_oven_drawer_position,
                    core_oven_number: entry.core.core_soak_times.core_oven_number,
                    soak_temperature_f: entry.core.core_soak_times.soak_temperature_f,
                    time_minutes: entry.core.core_soak_times.time_minutes,
                })
            })
            console.log(this.tableData);
            this.coreModelData = data;
        },
        coreSearchChange(e) {

        },
    },
    mounted() {
        this.locationSearch = window.location.search;
        this.getCoreModelData();
    }
}
</script>
