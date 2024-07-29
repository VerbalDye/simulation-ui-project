<template>
    <LoadingModal :display="loading" :estimatedLoadingTime="5000" />
    <Header />
    <div class="site-container">
        <Sidebar />
        <div class="content">
            <h1>Process Time Defaults</h1>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import titleMixin from '../mixins/titleMixin';
import Sidebar from '@/components/Sidebar.vue';
import auth from '../utils/auth';
import dataRequest from '@/utils/dataRequest';
import dayjs from 'dayjs';
export default {
    data() {
        return {
            assetData: {},
            experimentID: 2,
        }
    },
    mixins: [titleMixin],
    title: 'Process Time Default',
    components: { Sidebar, Header },
    methods: {
        async getAssetData() {
            let data = await dataRequest("/api/experiment/asset/" + this.experimentID, "GET");
            // console.log(data);
            this.assetData = data.map(e => e.asset);
        },
        async getProcessTimeData() {
            // let data = await dataRequest("/api/")
        }
    },
    mounted() {
        this.getAssetData();
    }
}
</script>

<style>

</style>