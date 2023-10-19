<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <div class="content">
            <div class="experiment">
                <h1>Experiment Design Tool</h1>
                <main>
                    <div class="section">
                        <h2>Start</h2>
                        <router-link to="/experiments/design" class="experiment-start-options"><i class="bi bi-file-earmark-plus-fill"></i> New
                            Experiment...</router-link>
                        <router-link to="/experiments/search" class="experiment-start-options"><i class="bi bi-folder-fill"></i> Open
                            Experiment Results...</router-link>
                    </div>
                    <div class="section">
                        <h2>Recent</h2>
                        <table v-if="recentExperiments" class="full-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Scenario</th>
                                    <th>Created By</th>
                                    <th>Date Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="row in this.recentExperiments">
                                    <td><router-link class="experiment-start-options"
                                            :to="'/experiments/design/experiment-configuration/' + row.experiment_id">{{
                                                row.experiment_name }}</router-link></td>
                                    <td>{{ row.scenario.scenario_name }}</td>
                                    <td>{{ row.user.first_name + " " + row.user.last_name }}</td>
                                    <td>{{ dayjs(row.created).format("M-D-YYYY h:mm:ss") }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p v-else>No Recent Experiments</p>
                    </div>
                    <div v-if="isAdmin" class="section">
                        <h2>Admin Controls</h2>
                        <router-link to="/admin/add-asset" class="link-button space">Asset Management</router-link>
                    </div>
                </main>
            </div>
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
            recentExperiments: null,
            dayjs: dayjs,
            isAdmin: false
        }
    },
    mixins: [titleMixin],
    title: 'Experiments',
    components: { Sidebar, Header },
    methods: {
        async getRecentExperiments() {
            let user = await auth.getProfile();
            let data = await dataRequest("/api/experiment/user/" + user.user_id, "GET");
            if (data.length) {
                this.recentExperiments = [...data];
            }
        }
    },
    mounted() {
        this.getRecentExperiments();
        this.isAdmin = auth.isAdmin();
    }
}
</script>

<style>
.experiment main {
    margin: 20px;
}

.experiment .section {
    margin: 0 0 10px 0;
}

.experiment-start-options {
    display: block;
    margin: 0 5px;
    padding: 5px 0;
    color: var(--black);
    text-decoration: none;
}
</style>
