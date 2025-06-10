<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <AdminSidebar />
        <div>
            <h1>Job Management</h1>
            <div>
                <!-- <button @click="downloadTemplate">Download Template</button> -->
                <!-- <div v-if="this.backlogData" class="space">
                    This experiment has Backlog Data. If you would like to overwrite, upload new backlog
                    data
                    below and click "Upload".
                </div> -->
                <!-- <h4>Start Date</h4>
                <input type="date" :value="demandSettings.startDate" name="backlog-start-date-input" class="space"
                    @input="e => demandSettings.startDate = e.target.value">
                <div>
                    <label for="backlog-input">Upload Backlog</label>
                    <input type="file" name="backlog-input" id="backlog-input" class="space" accept=".csv">
                </div>
                <div class="flex-right">
                    <button @click="uploadBacklog">Upload</button>
                </div> -->
                <!-- <div v-if="jobData && jobDropdownData" class="limit-width">
                    <SmartTable :jsonData="jobData" :advancedSearchEnabled="false" :id="4"
                        :excludedColumns="['job_location_id', 'job_core_id']" :dropdownData="jobDropdownData"
                        @selection-change="handleJobSelectionChange" />
                </div> -->
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
import SmartTable from '@/components/SmartTable.vue';
export default {
    data() {
        return {
            links: null
        }
    },
    components: { AdminSidebar, Header, Sidebar, SmartTable },
    mixins: [titleMixin],
    title: 'Job Management',
    methods: {

    },
    mounted() {
        this.locationSearch = window.location.search;
    }
}
</script>
