<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <AdminSidebar />
        <div class="content">
            <h1>Worker Management</h1>
            <div class="flex-between">
                <div class="card-with-title">
                    <div class="card-title">Create Worker</div>
                    <form id="login-form" @submit="handleCreateWorker">
                        <table class="grid-less">
                            <tr>
                                <th><label for="name-input">Name: </label></th>
                                <td><input type="text" id="name-input" name="name-input"></td>
                            </tr>
                            <tr>
                                <th><label for="shift-select">Shift:</label></th>
                                <td>
                                    <select id="shift-select" name="shift-select">
                                        <option v-for="shift in shiftData" :value="shift.shift_id">{{ shift.crew }}</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>Skills:</th>
                                <td>
                                    <VueMultiselect v-model="selectedSkills" :options="operations" :multiple="true"
                                        :close-on-select="false" placeholder="Select at least one skill">
                                        <template slot="selection" slot-scope="{ values, search, isOpen }"><span
                                                class="multiselect__single" v-if="values.length" v-show="!isOpen">{{
                                                    values.length
                                                }} options selected</span></template>
                                    </VueMultiselect>
                                </td>
                            </tr>
                        </table>
                        <button>Create Worker</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import AdminSidebar from '@/components/AdminSidebar.vue';
import titleMixin from '../mixins/titleMixin';
import dataRequest from '@/utils/dataRequest';
import VueMultiselect from 'vue-multiselect';
export default {
    data() {
        return {
            links: null,
            selectedSkills: [],
            operations: [],
            operationData: [],
            shiftData: [],
            // shifts: []
        }
    },
    components: { AdminSidebar, Header, Sidebar, VueMultiselect },
    mixins: [titleMixin],
    title: 'Worker Management',
    methods: {
        async getOperationData() {
            let data = await dataRequest("/api/operation/", "GET");
            console.log(data);
            this.operations = data.map(e => e.display_name)
            this.operationData = data;
        },
        async getShiftsData() {
            let data = await dataRequest("/api/shift/", "GET");
            console.log(data);
            // shifts.map(e => e.crew)
            this.shiftData = data;
        },
        async handleCreateWorker(e) {
            e.preventDefault();
            const body = { name: e.target[0].value, shifts: e.target[1].value, skills: this.getOperationIDs };
            let data = await dataRequest("/api/worker/", "POST", JSON.stringify(body), { statusOnly: true });
            if (data.status == 200) {
                window.alert("Worker Created!");
            } else {
                window.alert("Worker not created. Check all value are valid.")
            }
        },
        async handleDeleteWorker(e) {

        },
        async handleEditWorker(e) {

        },
        getOperationIDs() {
            let data = this.selectedSkills.map(e => {
                return this.operationData.find(f => f.display_name == e).operation_id
            })
            console.log(data);
            return data;
        },
        async getData() {
            await Promise.allSettled([
                this.getOperationData(),
                this.getShiftsData()
            ])
        }
    },
    mounted() {
        this.locationSearch = window.location.search;
        this.getData();
    }
}
</script>
