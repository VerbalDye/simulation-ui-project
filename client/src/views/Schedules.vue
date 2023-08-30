<template>
    <div class="site-container">
        <Sidebar />
        <div class="content">
            <Header />
            <h1>AnyLogic Simulation UI Project</h1>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import titleMixin from '../mixins/titleMixin';
import Sidebar from '@/components/Sidebar.vue';
export default {
    mixins: [titleMixin],
    title: 'Schedules',
    components: { Sidebar, Header }
}
</script>
