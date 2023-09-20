<template>
    <div :id="'plotly-chart-' + id">

    </div>
</template>

<script>
import Plotly from 'plotly.js-dist';
export default {
    data() {
        return {
            chartData: null,
            chartLayout: null
        }
    },
    props: ['data', 'x', 'xTitle', 'y', 'yTitle', 'group', 'hover', 'hoverTitles', 'title', 'id', 'type'],
    name: 'Header',
    methods: {
        formatData() {
            // let splitData = this.data.map(e => e.)
            let splitData = this.data.reduce((groups, item) => {
                if (!groups[item[this.group]]) { groups[item[this.group]] = []; }
                groups[item[this.group]].push(item);
                return groups;
            }, {});
            let formattedData = [];
            for (let key in splitData) {
                let group = splitData[key]
                let xData = [];
                let yData = [];
                let hoverData = [];
                group.forEach(entry => {
                    xData.push(entry[this.x])
                    yData.push(entry[this.y])
                    let text = "";
                    this.hover.forEach((key, index) => {
                        text += this.hoverTitles[index] + entry[key];
                        if (index !== this.hover.length - 1) {
                            text += ',\n'
                        }
                    })
                    hoverData.push(text);
                })
                formattedData.push({
                    x: xData,
                    y: yData,
                    mode: 'markers',
                    type: this.type,
                    name: key,
                    text: hoverData
                })
            }
            this.chartLayout = {
                title: this.title,
                xaxis: {
                    title: this.xTitle
                },
                yaxis: {
                    title: this.yTitle
                }
            }
            this.chartData = formattedData;
            console.log(this.chartData);
        }
    },
    mounted() {
        this.formatData();
        let chart = document.getElementById('plotly-chart-' + this.id)
        Plotly.newPlot(chart, this.chartData, this.chartLayout);
    },
    // watch: {
    //     chart: function (newVal, oldVal) {
    //         this.formatData(newVal);
    //         Plotly.react(

    //         )
    //     }
    // }
}
</script>

<style></style>