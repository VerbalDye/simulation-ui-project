<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <AdminSidebar />
        <div class="content">
            <h1>Core Management</h1>
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
            coreModelDate: {},
        }
    },
    components: { AdminSidebar, Header, Sidebar, SmartTable },
    mixins: [titleMixin],
    title: 'Core Management',
    methods: {
        async getCoreModelData() {
            let data = await dataRequest("/api/core-model/", "GET")
            console.log(data);
            this.coreModelDate = data;
        }
    },
    mounted() {
        this.locationSearch = window.location.search;
        this.getCoreModelData();
    }
}
</script>
