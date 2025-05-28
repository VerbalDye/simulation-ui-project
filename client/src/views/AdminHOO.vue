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
                                    :checked="this.closingData.monday.opens"
                                    @change="e => this.closingData.monday.opens = e.target.checked" />
                                <span class="slider round"></span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th>Closes Monday?</th>
                        <td>
                            <label class="switch">
                                <input name="mon-closes" id="mon-closes" type="checkbox"
                                    :checked="this.closingData.monday.closes"
                                    @change="e => this.closingData.monday.closes = e.target.checked" />
                                <span class="slider round"></span>
                            </label>
                        </td>
                    </tr>
                    <tr v-if="this.closingData.monday.opens">
                        <th><label for="mon-start">Start:</label></th>
                        <td><input name="mon-start" id="mon-start" type="time" :value="this.closingData.monday.starts"
                                step="3600" @change="timeChange($event, 'monday', 'start')" /></td>
                    </tr>
                    <tr v-if="this.closingData.monday.opens && this.closingData.monday.closes">
                        <th><label for="mon-start">End:</label></th>
                        <td><input name="mon-start" id="mon-start" type="time" :value="this.closingData.monday.ends"
                                step="3600" @change="timeChange($event, 'monday', 'end')" /></td>
                    </tr>
                </table>
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
                monday: { opens: true, closes: false, starts: "00:00", ends: null },
                tuesday: { opens: true, closes: false, starts: "00:00", ends: null },
                wednesday: { opens: true, closes: false, starts: "00:00", ends: null },
                thursday: { opens: true, closes: false, starts: "00:00", ends: null },
                friday: { opens: true, closes: false, starts: "00:00", ends: null },
                saturday: { opens: true, closes: false, starts: "00:00", ends: null },
                sunday: { opens: true, closes: false, starts: "00:00", ends: null },
            },
            days: [
                'monday',
                'tuesday',
                'wednesday',
                'thursday',
                'friday',
                'saturday',
                'sunday'
            ]
        }
    },
    components: { AdminSidebar, Header, Sidebar, SmartTable },
    mixins: [titleMixin],
    title: 'Hours of Operation Management',
    methods: {
        async getHoursOfOperation() {
            let data = await dataRequest("/api//hours-of-operation/default", "GET");
            console.log(data);
            this.hourOfOperationData = data;
            for (let i = 0; i < 7; i++) {
                if (data.find(e => e.day_num == i).start_time !== null) {
                    this.closingData[days[i]].opens = true;
                    this.closingData[days[i]].starts = data.find(e => e.day_num == i).start_time
                } else {
                    this.closingData[days[i]].opens = false;
                    this.closingData[days[i]].starts = null;
                }
                if (data.find(e => e.day_num == i).end_time !== null) {
                    this.closingData[days[i]].closes = true;
                    this.closingData[days[i]].ends = data.find(e => e.day_num == i).end_time;
                } else {
                    this.closingData[days[i]].closes = false;
                    this.closingData[days[i]].ends = null;
                }
            }
            // // monday
            // let mondayEntry = data.find(e => e.day_num == 0);
            // if (mondayEntry.start_time !== null) {
            //     this.closingData.monday.opens = true;
            //     this.closingData.monday.starts = mondayEntry.start_time
            // } else {
            //     this.closingData.monday.opens = false;
            //     this.closingData.monday.starts = null;
            // }
            // if (mondayEntry.end_time !== null) {
            //     this.closingData.monday.closes = true;
            //     this.closingData.monday.ends = mondayEntry.end_time;
            // } else {
            //     this.closingData.monday.closes = false;
            //     this.closingData.monday.ends = null;
            // }
            // // tuesday
            // let tuesdayEntry = data.find(e => e.day_num == 1);
            // if (tuesdayEntry.start_time !== null) {
            //     this.closingData.tuesday.opens = true;
            //     this.closingData.tuesday.starts = tuesdayEntry.start_time;
            // } else {
            //     this.closingData.tuesday.opens = false;
            //     this.closingData.tuesday.starts = null;
            // }
            // if (tuesdayEntry.end_time !== null) {
            //     this.closingData.tuesday.closes = true;
            //     this.closingData.tuesday.ends = tuesdayEntry.end_time;
            // } else {
            //     this.closingData.tuesday.closes = false;
            //     this.closingData.tuesday.ends = null;
            // }
            // // wednesday
            // if (data.find(e => e.day_num == 2).start_time !== null) {
            //     this.closingData.wednesday.opens = true;
            // } else {
            //     this.closingData.wednesday.opens = false;
            // }
            // if (data.find(e => e.day_num == 2).end_time !== null) {
            //     this.closingData.wednesday.closes = true;
            // } else {
            //     this.closingData.wednesday.closes = false;
            // }
            // // thursday
            // if (data.find(e => e.day_num == 3).start_time !== null) {
            //     this.closingData.thursday.opens = true;
            // } else {
            //     this.closingData.thursday.opens = false;
            // }
            // if (data.find(e => e.day_num == 3).end_time !== null) {
            //     this.closingData.thursday.closes = true;
            // } else {
            //     this.closingData.thursday.closes = false;
            // }
            // //friday
            // if (data.find(e => e.day_num == 4).start_time !== null) {
            //     this.closingData.friday.opens = true;
            // } else {
            //     this.closingData.friday.opens = false;
            // }
            // if (data.find(e => e.day_num == 4).end_time !== null) {
            //     this.closingData.friday.closes = true;
            // } else {
            //     this.closingData.friday.closes = false;
            // }
            // //saturday
            // if (data.find(e => e.day_num == 5).start_time !== null) {
            //     this.closingData.saturday.opens = true;
            // } else {
            //     this.closingData.saturday.opens = false;
            // }
            // if (data.find(e => e.day_num == 5).end_time !== null) {
            //     this.closingData.saturday.closes = true;
            // } else {
            //     this.closingData.saturday.closes = false;
            // }
            // //sunday
            // if (data.find(e => e.day_num == 6).start_time !== null) {
            //     this.closingData.sunday.opens = true;
            // } else {
            //     this.closingData.sunday.opens = false;
            // }
            // if (data.find(e => e.day_num == 6).end_time !== null) {
            //     this.closingData.sunday.closes = true;
            // } else {
            //     this.closingData.sunday.closes = false;
            // }
            console.log(this.closingData);
        },
        timeChange(e, day, type) {
            e.target.value = e.target.value.split(":")[0] + ":00:00"
            if (type == 'end') {
                if (this.closingData[day].starts.split(":")[0] > this.closingData[day].ends.split(":")[0]) {
                    e.target.value = this.closingData[day].starts;
                }
            }
        },
    },
    mounted() {
        this.locationSearch = window.location.search;
        this.getHoursOfOperation();
    }
}
</script>
