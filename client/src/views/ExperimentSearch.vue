<template>
    <Header />
    <div class="site-container">
        <Sidebar />
        <div class="content">
            <div class="experiment">
                <h1>Experiment Data</h1>
                <SmartTable v-if="experimentData" :jsonData="this.experimentData" :links="links" :columnHeadings="columnHeadings" :excludedColumns="excludedColumns"/>
            </div>
        </div>
    </div>
</template>

<script>
import SmartTable from '@/components/SmartTable.vue';
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import titleMixin from '../mixins/titleMixin';
import dataRequest from '@/utils/dataRequest';
import auth from '@/utils/auth';
export default {
    data() {
        return {
            experimentData: null,
            links: [],
            excludedColumns: ['user_id', 'scenario_id'],
            columnHeadings: {
                experiment_id: 'Experiment ID',
                experiment_name: 'Experiment Name',
                scenario_id: 'Scenario ID',
                created: 'Created At',
                last_modified: 'Last Modified',
                full_name: 'Full Name',
                user_email: 'User Email',
                scenario_name: 'Scenario'
            }
        }
    },
    components: { SmartTable, Sidebar, Header },
    mixins: [titleMixin],
    title: 'Experiment Search',
    methods: {
        async getExperimentData() {
            let userData = await auth.getProfile();
            let data = await dataRequest("/api/experiment/user/" + userData.user_id, "GET");
            this.links = data.map(e => '/experiments/design/results-review/' + e.experiment_id)
            this.experimentData = data.map(({ user, scenario, ...rest}) => {
                let obj = {...rest};
                obj.user_email = user.email;
                obj.full_name = user.first_name + ' ' + user.last_name;
                obj.scenario_name = scenario.scenario_name;
                return obj;
            });
            console.log(this.experimentData);
        }
    },
    mounted() {
        this.getExperimentData();
    }
}
</script>

<style>

</style>