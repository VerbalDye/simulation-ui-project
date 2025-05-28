<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <AdminSidebar />
        <div class="content">
            <h1>Hours of Operation Management</h1>
            <div v-for="day in this.days">
                <h2>{{ day[0].toUpperCase() + day.shift() }}</h2>
                <table class="grid-less">
                    <tr>
                        <th>Opens {{ day[0].toUpperCase() + day.shift() }}?</th>
                        <td>
                            <label class="switch">
                                <input :name="day+'-closes'" :id="day+'-closes'" type="checkbox"
                                    :checked="this.closingData[day].opens"
                                    @change="e => this.closingData[day].opens = e.target.checked" />
                                <span class="slider round"></span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th>Closes {{ day[0].toUpperCase() + day.shift() }}?</th>
                        <td>
                            <label class="switch">
                                <input :name="day+'-closes'" :id="day+'-closes'" type="checkbox"
                                    :checked="this.closingData[day].closes"
                                    @change="e => this.closingData[day].closes = e.target.checked" />
                                <span class="slider round"></span>
                            </label>
                        </td>
                    </tr>
                    <tr v-if="this.closingData[day].opens">
                        <th><label :for="day+'-start'">Start:</label></th>
                        <td><input :name="day+'-start'" :id="day+'-start'" type="time" :value="this.closingData[day].starts"
                                step="3600" @change="timeChange($event, day, 'start')" /></td>
                    </tr>
                    <tr v-if="this.closingData[day].opens && this.closingData[day].closes">
                        <th><label :for="day+'-end'">End:</label></th>
                        <td><input :name="day+'-end'" :id="day+'-end'" type="time" :value="this.closingData[day].ends"
                                step="3600" @change="timeChange($event, day, 'end')" /></td>
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
                    this.closingData[this.days[i]].opens = true;
                    this.closingData[this.days[i]].starts = data.find(e => e.day_num == i).start_time
                } else {
                    this.closingData[this.days[i]].opens = false;
                    this.closingData[this.days[i]].starts = null;
                }
                if (data.find(e => e.day_num == i).end_time !== null) {
                    this.closingData[this.days[i]].closes = true;
                    this.closingData[this.days[i]].ends = data.find(e => e.day_num == i).end_time;
                } else {
                    this.closingData[this.days[i]].closes = false;
                    this.closingData[this.days[i]].ends = null;
                }
            }
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
