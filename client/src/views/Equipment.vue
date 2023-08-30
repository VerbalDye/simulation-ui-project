<script>
import SmartTable from '@/components/SmartTable.vue';
import titleMixin from '@/mixins/titleMixin';
import dataRequest from '@/utils/dataRequest';
export default {
    data() {
        return {
            equipmentData: []
        }
    },
    components: { SmartTable },
    mixins: [titleMixin],
    title: 'Equipment',
    methods: {
        async getEquipmentData() {
            let data = dataRequest("/api/equipment/", "GET");
            this.equipmentData = data;
        }
    },
    mounted() {
        this.getEquipmentData();
    }
}
</script>

<template>
    <div class="equipment">
        <h1>Equipment Data</h1>
        <SmartTable :jsonData="this.equipmentData" />
    </div>
</template>