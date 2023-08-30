<template>
    <div class="site-container">
        <Sidebar />
        <div class="content">
            <Header />
            <h1>{{ this.experimentDetails.name }}</h1>
            <h3>Department: {{ this.experimentDetails.department }}</h3>
            <h3>Analysis Type: {{ this.experimentDetails.analysis_type }}</h3>
            <h3>Experiment Type: {{ this.experimentDetails.experiment_type }}</h3>
            <h3>Experiment Name: {{ this.experimentDetails.name }}</h3>
            <h2>Inputs</h2>

            <button @click="handleRunExperiment">Run Experiment</button>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import titleMixin from '../mixins/titleMixin';
import Sidebar from '@/components/Sidebar.vue';
export default {
    data() {
        return {
            experimentDetails: {}
        }
    },
    mixins: [titleMixin],
    title: 'Experiment Details',
    components: { Sidebar, Header },
    methods: {
        getExperimentDetails() {
            let expId = this.$route.params.id
            
            fetch("/api/experiment/" + expId, {
                method: "GET"
            })
                .then(response => {
                    if (response.status == 200) {
                        response.json().then(data => {
                            console.log(data);
                            this.experimentDetails = {...data};
                        })
                    } else {

                        // error handling
                        let html = "It seems an unknown error has occurred. Check your connection and try again. \n" + response.status + " " + response.responseText;
                        window.alert(html);
                        return;
                    }
                }).catch(function (error) {

                    // informs user of failure
                    let html = "We appear to be having trouble reaching the Database. Check your connection and try again. \n" + error;
                    window.alert(html);
                    return;
                });
        },
        handleRunExperiment() {
            window.alert("Experiment is now running (spoof)");
        }
    },
    mounted() {
        this.getExperimentDetails()
    }
}
</script>
