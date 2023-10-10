<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <div class="content">
            <h1>404: Page Not Found</h1>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import titleMixin from '../mixins/titleMixin';
import Sidebar from '@/components/Sidebar.vue';
export default {
    mixins: [titleMixin],
    title: 'Page Not Found',
    components: { Sidebar, Header }
}
</script>
