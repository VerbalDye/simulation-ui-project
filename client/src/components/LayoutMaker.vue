<template>
    <div class="simulation-layout" @mouseup="handleLayoutMouseup">
        <div class="main-content">
            <div>
                <menu :style="{ width: this.canvasProperties.width + 'px' }">
                    <div>
                        <button v-if="mode == 'layout-maker'" @click="handleLayoutSave">Save</button>
                    </div>
                    <div>
                        <button @click="handleZoom('+')">+</button>
                        <button @click="handleZoom('-')">-</button>
                    </div>
                </menu>
                <div v-if="this.id" class="canvas-container" :style="{ height: this.canvasProperties.height + 'px' }">
                    <canvas :id="'canvas-layout-' + this.id" @mousedown="handleLayoutMousedown"
                        @mousemove="handleLayoutMousemove" :width="this.canvasProperties.width"
                        :height="this.canvasProperties.height"></canvas>
                </div>
            </div>
            <!-- <div id="info">
                <EquipmentDetails :equipmentData="this.equipmentData[this.selectedObjectIndex]" />
            </div> -->
        </div>
    </div>
</template>
  
<script>
// import EquipmentDetails from '@/components/EquipmentDetails.vue';
import dataRequest from '@/utils/dataRequest';
export default {
    data() {
        return {
            vueCanvas: null,
            canvasProperties: {
                width: 500,
                height: 300,
                zoomLevel: 1,
                viewX: 0,
                viewY: 0,
                backgroundRatio: 2.6032
            },
            mouseState: {
                x: 0,
                y: 0,
                pressed: false
            },
            viewScope: {
                shipyard: null,
                shop: null,
                building: null,
                floor: 1
            },
            selectedObjectIndex: null,
            destinationIDs: {},
            secondaryDestinationIDs: {}
        }
    },
    name: 'LayoutMaker',
    props: ['mode', 'assetData', 'routingData', 'selectedOperation', 'id'],
    emits: ['selection-change'],
    methods: {
        drawLayout() {
            // clear canvas
            this.vueCanvas.clearRect(0, 0, this.canvasProperties.width, this.canvasProperties.height);

            if (this.mode == "site-map") {
                // const usaMapImg = document.getElementById("us-map");
                // this.vueCanvas.drawImage(usaMapImg, 50, 50, this.canvasProperties.width - 100, this.canvasProperties.height - 100);
            } else if (this.mode == "layout-maker") {
                // if (this.viewScope.building == 431) {
                //     let c = this.canvasProperties
                //     const building431Img = document.getElementById("B431");
                //     this.vueCanvas.drawImage(building431Img, c.viewX * -c.zoomLevel, c.height + (c.viewY - 335) * c.zoomLevel, 1000 * c.zoomLevel, (1000 / c.backgroundRatio) * c.zoomLevel);
                // } else if (this.viewScope.building == 460) {
                //     const building460Img = document.getElementById("B460");
                //     this.vueCanvas.drawImage(building460Img, 50, 50, this.canvasProperties.width - 100, this.canvasProperties.height - 100);
                // }
                this.vueCanvas.beginPath();
                this.assetData.forEach((item, index) => {
                    // if (item.asset.BuildingID == this.viewScope.building) {
                    let resizedItem = this.translateAssetDimensions(item.asset);
                    this.vueCanvas.save();
                    if (this.selectedObjectIndex == index) {
                        this.vueCanvas.strokeStyle = '#e60505'
                    } else {
                        this.vueCanvas.globalAlpha = 0.5;
                    }
                    this.vueCanvas.strokeRect(resizedItem.x, resizedItem.y, resizedItem.width, resizedItem.height);
                    this.vueCanvas.restore()
                    // }
                })
                this.vueCanvas.stroke();
                this.vueCanvas.fillText("(" + this.canvasProperties.viewX + "," + this.canvasProperties.viewY + ")", 0, this.canvasProperties.height - 4);
            } else if (this.mode == 'operation-map') {
                this.vueCanvas.beginPath();
                this.assetData.forEach((item) => {
                    // if (item.asset.BuildingID == this.viewScope.building) {
                    let resizedItem = this.translateAssetDimensions(item.asset);
                    this.vueCanvas.save();
                    this.vueCanvas.strokeStyle = '#000000';
                    if (item.asset.operation_to_locations.length == 0) {
                        this.vueCanvas.fillStyle = "rgb(127, 127, 127)";
                        // operation to location may need to be iterated in the future
                    } else if (item.asset.operation_to_locations[0].operation_id == this.selectedOperation.task_sequence.operation_id) {
                        this.vueCanvas.fillStyle = "rgb(0, 146, 188)";
                    } else {
                        this.vueCanvas.fillStyle = "rgb(34, 42, 53)";
                    }
                    this.vueCanvas.fillRect(resizedItem.x, resizedItem.y, resizedItem.width, resizedItem.height);
                    this.vueCanvas.strokeRect(resizedItem.x, resizedItem.y, resizedItem.width, resizedItem.height);
                    this.vueCanvas.restore()
                })
                this.vueCanvas.stroke();
                this.vueCanvas.fillText("(" + this.canvasProperties.viewX + "," + this.canvasProperties.viewY + ")", 0, this.canvasProperties.height - 4);
            } else if (this.mode == 'routing-map') {
                this.assetData.forEach((item) => {
                    let resizedItem = this.translateAssetDimensions(item.asset);
                    let asset_id = item.asset.asset_id
                    this.vueCanvas.save();
                    this.vueCanvas.strokeStyle = '#000000';
                    if (item.asset.operation_to_locations[0].operation_id == this.selectedOperation.task_sequence.operation_id) {
                        this.vueCanvas.fillStyle = "rgb(34, 42, 53)";
                    } else if (this.destinationIDs[asset_id]) {
                        this.vueCanvas.fillStyle = "rgb(68, 84, 106)";
                    } else if (this.secondaryDestinationIDs[asset_id]) {
                        this.vueCanvas.fillStyle = "rgb(132,151,176)";
                    } else {
                        this.vueCanvas.fillStyle = "rgb(127, 127, 127)";
                    }
                    this.vueCanvas.fillRect(resizedItem.x, resizedItem.y, resizedItem.width, resizedItem.height);
                    this.vueCanvas.strokeRect(resizedItem.x, resizedItem.y, resizedItem.width, resizedItem.height);
                    this.vueCanvas.restore()
                });
                this.drawRoutingArrows(this.destinationIDs, "rgb(34, 42, 53)");
                this.drawRoutingArrows(this.secondaryDestinationIDs, "rgb(68, 84, 106)");
                this.vueCanvas.fillText("(" + this.canvasProperties.viewX + "," + this.canvasProperties.viewY + ")", 0, this.canvasProperties.height - 4);
            }
        },
        drawArrow(vueCanvas, fromX, fromY, toX, toY, color) {
            var headLength = 10; // length of head in pixels
            var dx = toX - fromX;
            var dy = toY - fromY;
            var angle = Math.atan2(dy, dx);
            vueCanvas.save();
            vueCanvas.fillStyle = color;
            vueCanvas.strokeStyle = color;
            vueCanvas.beginPath();
            vueCanvas.moveTo(fromX, fromY);
            vueCanvas.lineTo(toX, toY);
            vueCanvas.stroke();
            vueCanvas.beginPath();
            vueCanvas.moveTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
            vueCanvas.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
            vueCanvas.lineTo(toX, toY);
            vueCanvas.closePath();
            vueCanvas.stroke();
            vueCanvas.fill();
            vueCanvas.restore();
        },
        drawRoutingArrows(ids, color) {
            let destinations = Object.keys(ids);
            destinations.forEach(destination => {
                let source = ids[destination];
                let resizedSource = this.translateAssetDimensions(this.assetData.find(e => e.asset_id == source).asset);
                let resizedDestination = this.translateAssetDimensions(this.assetData.find(e => e.asset_id == destination).asset);
                if (resizedSource.x !== resizedDestination.x && resizedSource.y !== resizedDestination.y) {
                    this.drawArrow(this.vueCanvas, resizedSource.x + resizedSource.width, resizedSource.y + resizedSource.height / 2, resizedDestination.x, resizedDestination.y + resizedDestination.height / 2, color);
                }
            })
        },
        getRoutingInfo() {
            this.destinationIDs = {};
            this.secondaryDestinationIDs = {};
            let sources = this.assetData.filter(item => item.asset.operation_to_locations[0].operation_id == this.selectedOperation.task_sequence.operation_id);
            sources.forEach(source => {
                let destinations = this.routingData.filter(e => e.routing.origin == source.asset_id);
                // console.log(destinations.map(e => {
                //     let obj = {};
                //     obj.experiment_id = e.experiment_id;
                //     obj.iteration_number = e.iteration_number;
                //     obj.travel_allowed = e.routing.travel_allowed;
                //     obj.origin = e.routing.origin;
                //     obj.destination = e.routing.destination;
                //     obj.experiment_routing_id = e.experiment_routing_id;
                //     return obj;
                // }));
                destinations.forEach(destination => {
                    this.destinationIDs[destination.routing.destination] = source.asset_id;
                    let secondaryDestinations = this.routingData.filter(e => e.routing.origin == destination.routing.destination);
                    secondaryDestinations.forEach(secDestination => {
                        this.secondaryDestinationIDs[secDestination.routing.destination] = destination.routing.destination;
                    })
                })
            });
            // console.log("Destination IDs", this.destinationIDs);
            // console.log("Secondary Destination IDs", this.secondaryDestinationIDs);
        },
        translateAssetDimensions(asset) {
            let resizedItem = {};
            let c = this.canvasProperties;
            resizedItem.x = ((asset.pos_x - (asset.dim_width_feet / 2)) - c.viewX) * c.zoomLevel;
            resizedItem.y = c.height - (((asset.pos_y + (asset.dim_length_feet / 2)) - c.viewY) * c.zoomLevel);
            resizedItem.width = asset.dim_width_feet * c.zoomLevel;
            resizedItem.height = asset.dim_length_feet * c.zoomLevel;
            return resizedItem;
        },
        handleLayoutMousedown(event) {
            this.mouseState.pressed = true;
            this.mouseState.x = event.offsetX;
            this.mouseState.y = event.offsetY;
            this.handleCollision();
            this.drawLayout();
        },
        handleLayoutMouseup() {
            this.mouseState.pressed = false;
            // this.mouseState.x = event.offsetX;
            // this.mouseState.y = event.offsetY;
            this.drawLayout();
        },
        handleLayoutMousemove(event) {
            if (this.mouseState.pressed) {
                if (this.selectedObjectIndex == null) {
                    this.canvasProperties.viewX = this.canvasProperties.viewX + (this.mouseState.x - event.offsetX) / this.canvasProperties.zoomLevel
                    this.canvasProperties.viewY = this.canvasProperties.viewY - (this.mouseState.y - event.offsetY) / this.canvasProperties.zoomLevel
                    this.mouseState.x = event.offsetX;
                    this.mouseState.y = event.offsetY;
                } else if (this.mode == 'layout-maker') {
                    this.assetData[this.selectedObjectIndex].changed = true;
                    this.assetData[this.selectedObjectIndex].asset.pos_x = this.assetData[this.selectedObjectIndex].asset.pos_x - (this.mouseState.x - event.offsetX) / this.canvasProperties.zoomLevel
                    this.assetData[this.selectedObjectIndex].asset.pos_y = this.assetData[this.selectedObjectIndex].asset.pos_y + (this.mouseState.y - event.offsetY) / this.canvasProperties.zoomLevel
                    this.mouseState.x = event.offsetX;
                    this.mouseState.y = event.offsetY;
                }
            }
            this.drawLayout();
        },
        handleCollision() {
            if (this.mode == 'layout-maker') {
                let matches = [];
                this.assetData.forEach((item, index) => {
                    let resizedItem = this.translateAssetDimensions(item.asset);
                    if (this.mouseState.x >= resizedItem.x && this.mouseState.x <= resizedItem.x + resizedItem.width && this.mouseState.y >= resizedItem.y && this.mouseState.y <= resizedItem.y + resizedItem.height) {
                        matches.push(index);
                    }
                })
                if (matches.length == 0) {
                    this.selectedObjectIndex = null;
                } else if (matches.length == 1) {
                    this.selectedObjectIndex = matches[0];
                } else {
                    if (matches.includes(this.selectedObjectIndex)) {
                        let prevIndex = matches.indexOf(this.selectedObjectIndex);
                        if (prevIndex == matches.length - 1) {
                            this.selectedObjectIndex = matches[0];
                        } else {
                            this.selectedObjectIndex = matches[prevIndex + 1]
                        }
                    } else {
                        this.selectedObjectIndex = matches[0];
                    }
                }
                // this.handleSelectionChange();
            }
        },
        // handleSelectionChange() {
        //     this.$emit('selection-change', this.assetData[this.selectedObjectIndex]);
        // },
        handleZoom(zoom) {
            let c = this.canvasProperties
            if (zoom == "+") {
                c.viewX = c.viewX + c.width / (4 * c.zoomLevel)
                c.viewY = c.viewY + c.height / (4 * c.zoomLevel);
                c.zoomLevel = c.zoomLevel * 2;
            } else if (zoom == "-") {
                c.viewX = c.viewX - c.width / (2 * c.zoomLevel);
                c.viewY = c.viewY - c.height / (2 * c.zoomLevel);
                c.zoomLevel = c.zoomLevel / 2;
            }
            this.drawLayout();
        },
        handleBuildingChange() {
            // this.mode = "layout-maker";
            this.canvasProperties.zoomLevel = 1;
            this.canvasProperties.viewX = 0;
            this.canvasProperties.viewY = 0;
            this.viewScope.building = parseInt(document.getElementById("building").value);
            this.drawLayout();
        },
        async handleLayoutSave() {
            let changedData = this.assetData.filter(item => item.changed);
            changedData = changedData.map(item => item.asset);
            changedData.forEach(item => {
                item.is_default = false;
                delete item['asset_id'];
            });
            let newAssetData = await dataRequest("/api/asset/create-bulk", "POST", JSON.stringify(changedData))
            newAssetData.forEach(item => {
                let assetAssociation = this.assetData.filter(original => original.asset.asset_name == item.asset_name);
                dataRequest("/api/experiment/asset/" + assetAssociation[0].experiment_asset_id, "PUT", JSON.stringify({ asset_id: item.asset_id }))
            });
        }
    },
    mounted() {
        var c = document.getElementById("canvas-layout-" + this.id);
        var ctx = c.getContext("2d");
        this.vueCanvas = ctx;
        this.vueCanvas.strokeStyle = "blue";
        this.vueCanvas.font = "18px Arial";
        this.drawLayout();
    },
    watch: {
        selectedOperation: function (newVal, oldVal) {
            if (this.mode == "routing-map") {
                this.getRoutingInfo();
            }
            this.drawLayout();
        }
    }
    // components: { EquipmentDetails }
}
</script>

<style>
.canvas-container {
    border: solid 2px var(--black);
    display: inline-block;
    margin: 0 20px 20px 20px;
}
</style>