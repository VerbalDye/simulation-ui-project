<template>
    <component is="script" type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></component>
    <div id="timeline"></div>
</template>


<script>
export default {
    data() {
        return {
            interval: null
        }
    },
    props: ['data'],
    name: 'TimelineChart',
    methods: {
        drawChart() {
            try {
                var container = document.getElementById('timeline');
                var chart = new google.visualization.Timeline(container);
                var dataTable = new google.visualization.DataTable();
                dataTable.addColumn({ type: 'string', id: 'Asset' });
                dataTable.addColumn({ type: 'string', id: 'Name' });
                dataTable.addColumn({ type: 'date', id: 'Start' });
                dataTable.addColumn({ type: 'date', id: 'End' });
                dataTable.addRows(this.data);
                var options = {
                    timeline: { groupByRowLabel: true },
                    backgroundColor: '#d5e4ed',
                    hAxis: {
                        format: 'M/d haa'
                    }
                };
                chart.draw(dataTable, options);
            } catch (err) {
                console.log(err);
            }
        }
    },
    mounted() {
        // let google;
        this.interval = setInterval(e => {
            try {
                if (google) {
                    clearInterval(this.interval);
                    console.log(google);
                    google.charts.load('current', { 'packages': ['timeline'] });
                    google.charts.setOnLoadCallback(this.drawChart);
                }
            } catch (err) {
                console.log(err);
            }
        }, 100)
    },
    watch: {
        data: function (newVal, oldVal) {
            this.drawChart()
        },
    }
}
</script>

<style>
#timeline {
    height: 75vh;
}
</style>