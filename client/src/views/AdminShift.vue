<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <AdminSidebar />
        <div class="content">
            <h1>Shift Management</h1>
            <div class="flex-between">
                <div class="card-with-title">
                    <div class="card-title">Create Shift</div>
                    <form id="login-form" @submit="handleCreateShift">
                        <table class="grid-less">
                            <tr>
                                <th><label for="crew-input">Crew Name: </label></th>
                                <td><input type="text" id="crew-input" name="crew-input"></td>
                            </tr>
                            <tr>
                                <th><label for="begin-input">Starting Time: </label></th>
                                <td><input type="time" id="begin-input" name="begin-input"></td>
                            </tr>
                            <tr>
                                <th><label for="end-input">Ending Time: </label></th>
                                <td><input type="time" id="end-input" name="end-input"></td>
                            </tr>
                        </table>
                        <button>Create Shift</button>
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
export default {
    data() {
        return {
            links: null
        }
    },
    components: { AdminSidebar, Header, Sidebar },
    mixins: [titleMixin],
    title: 'Shift Management',
    methods: {
        async handleCreateShift(e) {
            e.preventDefault();
            const body = { crew: e.target[0].value, begin: e.target[1].value, end: e.target[2].value };
            let data = await dataRequest("/api/shift/", "POST", JSON.stringify(body), { statusOnly: true });
            if (data.status == 200) {
                window.alert("Shift Created!");
            } else {
                window.alert("Shift not created. Check all value are valid.")
            }
        },
    },
    mounted() {
        this.locationSearch = window.location.search;
    }
}
</script>
