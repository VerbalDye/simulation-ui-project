<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <AdminSidebar />
        <div class="content">
            <h1>Hours of Operation Management</h1>
            <div>
                <h2>Monday</h2>
                <table class="grid-less">
                    <tr>
                        <th>Opens Monday?</th>
                        <td>
                            <label class="switch">
                                <input name="mon-closes" id="mon-closes" type="checkbox"
                                    @change="e => this.closingData.monday.opens = e.target.value" />
                                <span class="slider round"></span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th>Closes Monday?</th>
                        <td>
                            <label class="switch">
                                <input name="mon-closes" id="mon-closes" type="checkbox"
                                    @change="e => this.closingData.monday.opens = e.target.value" />
                                <span class="slider round"></span>
                            </label>
                        </td>
                    </tr>
                </table>
                <div v-if="this.closingData.monday.opens">
                    <label for="mon-start">Start:</label>
                    <input name="mon-start" id="mon-start" type="time" value="00:00" step="3600" />
                </div>
                <div v-if="this.closingData.monday.closes">
                    <label for="mon-start">End:</label>
                    <input name="mon-start" id="mon-start" type="time" value=":00" step="3600" />
                </div>
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
            hourOfOperationData: {},
            closingData: {
                monday: {},
                tuesday: {},
                wednesday: {},
                thursday: {},
                friday: {},
                saturday: {},
                sunday: {},
            }
        }
    },
    components: { AdminSidebar, Header, Sidebar, SmartTable },
    mixins: [titleMixin],
    title: 'Hours of Operation Management',
    methods: {
        async getHoursOfOperation() {
            let data = await dataRequest("/api//hours-of-operation", "GET");
            console.log(data);
            this.hourOfOperationData = data;
            // monday
            if (data.find(e => e.day_num == 0).start_time !== null) {
                this.closingData.monday.opens == true;
            } else {
                this.closingData.monday.opens == false;
            }
            if (data.find(e => e.day_num == 0).end_time !== null) {
                this.closingData.monday.closes == true;
            } else {
                this.closingData.monday.closes == false;
            }
            // tuesday
            if (data.find(e => e.day_num == 1).start_time !== null) {
                this.closingData.tuesday.opens == true;
            } else {
                this.closingData.tuesday.opens == false;
            }
            if (data.find(e => e.day_num == 1).end_time !== null) {
                this.closingData.tuesday.closes == true;
            } else {
                this.closingData.tuesday.closes == false;
            }
            // wednesday
            if (data.find(e => e.day_num == 2).start_time !== null) {
                this.closingData.wednesday.opens == true;
            } else {
                this.closingData.wednesday.opens == false;
            }
            if (data.find(e => e.day_num == 2).end_time !== null) {
                this.closingData.wednesday.closes == true;
            } else {
                this.closingData.wednesday.closes == false;
            }
            // thursday
            if (data.find(e => e.day_num == 3).start_time !== null) {
                this.closingData.thursday.opens == true;
            } else {
                this.closingData.thursday.opens == false;
            }
            if (data.find(e => e.day_num == 3).end_time !== null) {
                this.closingData.thursday.closes == true;
            } else {
                this.closingData.thursday.closes == false;
            }
            //friday
            if (data.find(e => e.day_num == 4).start_time !== null) {
                this.closingData.friday.opens == true;
            } else {
                this.closingData.friday.opens == false;
            }
            if (data.find(e => e.day_num == 4).end_time !== null) {
                this.closingData.friday.closes == true;
            } else {
                this.closingData.friday.closes == false;
            }
            //saturday
            if (data.find(e => e.day_num == 5).start_time !== null) {
                this.closingData.saturday.opens == true;
            } else {
                this.closingData.saturday.opens == false;
            }
            if (data.find(e => e.day_num == 5).end_time !== null) {
                this.closingData.saturday.closes == true;
            } else {
                this.closingData.saturday.closes == false;
            }
            //sunday
            if (data.find(e => e.day_num == 6).start_time !== null) {
                this.closingData.sunday.opens == true;
            } else {
                this.closingData.sunday.opens == false;
            }
            if (data.find(e => e.day_num == 6).end_time !== null) {
                this.closingData.sunday.closes == true;
            } else {
                this.closingData.sunday.closes == false;
            }
            console.log(this.closingData);
        },
    },
    mounted() {
        this.locationSearch = window.location.search;
        this.getHoursOfOperation();
    }
}
</script>
