<template>
    <div class="site-container">
        <Sidebar />
        <div class="content">
            <Header />
            <div class="experiment">
                <h1>Experiment Data</h1>
                <SmartTable :jsonData="this.experimentData" />
            </div>
        </div>
    </div>
</template>

<script>
import SmartTable from '@/components/SmartTable.vue';
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import titleMixin from '../mixins/titleMixin';
import dataRequest from '@/utils/dataRequest';
export default {
    data() {
        return {
            experimentData: []
        }
    },
    components: { SmartTable, Sidebar, Header },
    mixins: [titleMixin],
    title: 'Experiment Search',
    methods: {
        async getExperimentData() {
            let data = await dataRequest("/api/experiment/", "GET");
            this.experimentData = data;
        }
    },
    mounted() {
        this.getExperimentData();
    }
}
</script>