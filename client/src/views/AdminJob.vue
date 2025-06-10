<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <AdminSidebar />
        <div class="content">
            <h1>Job Management</h1>
            <div>
                
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
