<template>
    <div v-if="this.equipmentData !== undefined" class="equipment-details">
        <div class="input-container">
            <label for="EquipmentID-input">Equipment ID:</label>
            <input @change="handleChange" name="EquipmentID-input" id="EquipmentID-input" type="text"
                :value="this.equipmentData.EquipmentID">
        </div>
        <div class="input-container">
            <label for="BuildingID-input">Building ID:</label>
            <input @change="handleChange" name="BuildingID-input" id="BuildingID-input" type="text"
                :value="this.equipmentData.BuildingID">
        </div>
        <div class="input-container">
            <label for="floor-num-input">Floor Number:</label>
            <input @change="handleChange" name="floor-num-input" id="floor-num-input" type="number"
                :value="this.equipmentData.FloorNum">
        </div>
        <div class="input-container">
            <label for="asset-num-input">Asset Number:</label>
            <input @change="handleChange" name="asset-num-input" id="asset-num-input" type="text"
                :value="this.equipmentData.AssetNum">
        </div>
        <div class="input-container">
            <label for="alpha-input">Alpha:</label>
            <input @change="handleChange" name="alpha-input" id="alpha-input" type="text" :value="this.equipmentData.Alpha">
        </div>
        <div class="input-container">
            <label for="auto-cad-description-input">AutoCad Description:</label>
            <input @change="handleChange" name="auto-cad-description-input" id="auto-cad-description-input" type="text"
                :value="this.equipmentData.AutoCadDescription">
        </div>
        <div class="input-container">
            <label for="orbis-description-input">ORBIS Description:</label>
            <input @change="handleChange" name="orbis-description-input" id="orbis-description-input" type="text"
                :value="this.equipmentData.ORBISDescription">
        </div>
        <div class="input-container">
            <label for="equipment-location-input">Equipment Location:</label>
            <input @change="handleChange" name="equipment-location-input" id="equipment-location-input" type="text"
                :value="this.equipmentData.EquipmentLocation">
        </div>
        <div class="input-container">
            <label for="notes-input">Notes:</label>
            <input @change="handleChange" name="notes-input" id="notes-input" type="text" :value="this.equipmentData.Notes">
        </div>
        <div class="input-container">
            <label for="orbis-verified-input">ORBIS Verified:</label>
            <input @change="handleChange" name="orbis-verified-input" id="orbis-verified-input" type="checkbox"
                :checked="this.equipmentData.ORBISVerified">
        </div>
        <div class="input-container">
            <label for="orientation-input">Orientation:</label>
            <input @change="handleChange" name="orientation-input" id="orientation-input" type="text"
                :value="this.equipmentData.Orientation">
        </div>
        <div class="input-container">
            <label for="x-pos-input">X Position:</label>
            <input @change="handleChange" name="x-pos-input" id="x-pos-input" type="number"
                :value="this.equipmentData.Xpos">
        </div>
        <div class="input-container">
            <label for="y-pos-input">Y Position:</label>
            <input @change="handleChange" name="y-pos-input" id="y-pos-input" type="number"
                :value="this.equipmentData.Ypos">
        </div>
        <div class="input-container">
            <label for="z-pos-input">Z Position:</label>
            <input @change="handleChange" name="z-pos-input" id="z-pos-input" type="number"
                :value="this.equipmentData.Zpos">
        </div>
        <div class="input-container">
            <label for="ac-xdim-input">X Dimension, AutoCad:</label>
            <input @change="handleChange" name="ac-xdim-input" id="ac-xdim-input" type="number"
                :value="this.equipmentData.AC_XDIM">
        </div>
        <div class="input-container">
            <label for="ac-ydim-input">Y Dimension, AutoCad:</label>
            <input @change="handleChange" name="ac-ydim-input" id="ac-ydim-input" type="number"
                :value="this.equipmentData.AC_YDim">
        </div>
        <div class="input-container">
            <label for="ac-zdim-input">Z Dimension, AutoCad:</label>
            <input @change="handleChange" name="ac-zdim-input" id="ac-zdim-input" type="number"
                :value="this.equipmentData.AC_ZDim">
        </div>
        <div class="input-container">
            <label for="orbis-xdim-input">X Dimension, ORBIS:</label>
            <input @change="handleChange" name="orbis-xdim-input" id="orbis-xdim-input" type="number"
                :value="this.equipmentData.ORBIS_XDim">
        </div>
        <div class="input-container">
            <label for="orbis-ydim-input">Y Dimension, ORBIS:</label>
            <input @change="handleChange" name="orbis-ydim-input" id="orbis-ydim-input" type="number"
                :value="this.equipmentData.ORBIS_YDim">
        </div>
        <div class="input-container">
            <label for="orbis-zdim-input">Z Dimension, ORBIS:</label>
            <input @change="handleChange" name="orbis-zdim-input" id="orbis-zdim-input" type="number"
                :value="this.equipmentData.ORBIS_ZDim">
        </div>
        <div class="input-container">
            <label for="safe-x-input">Safe X:</label>
            <input @change="handleChange" name="safe-x-input" id="safe-x-input" type="number"
                :value="this.equipmentData.SafeX">
        </div>
        <div class="input-container">
            <label for="safe-y-input">Safe Y:</label>
            <input @change="handleChange" name="safe-y-input" id="safe-y-input" type="number"
                :value="this.equipmentData.SafeY">
        </div>
        <button @click="handleSave">Save</button>
        <button>Reset</button>
    </div>
</template>

<script>
import dataRequest from '@/utils/dataRequest'
export default {
    data() {
        return {
            newEquipmentData: {}
        }
    },
    name: 'EquipmentDetails',
    props: ['equipmentData'],
    methods: {
        handleSave() {
            let inputArray = []
            document.querySelectorAll(".input-container").forEach(inputElement => {
                inputArray.push(inputElement.children[1].value);
            })

            this.newEquipmentData.EquipmentID = inputArray[0];
            this.newEquipmentData.BuildingID = inputArray[1];
            this.newEquipmentData.FloorNum = inputArray[2];
            this.newEquipmentData.AssetNum = inputArray[3];
            this.newEquipmentData.Alpha = inputArray[4];
            this.newEquipmentData.AutoCadDescription = inputArray[5];
            this.newEquipmentData.ORBISDescription = inputArray[6];
            this.newEquipmentData.EquipmentLocation = inputArray[7];
            this.newEquipmentData.Notes = inputArray[8];
            this.newEquipmentData.ORBISVerified = document.getElementById("orbis-verified-input").checked;
            this.newEquipmentData.Orientation = inputArray[10];
            this.newEquipmentData.Xpos = inputArray[11];
            this.newEquipmentData.Ypos = inputArray[12];
            this.newEquipmentData.Zpos = inputArray[13];
            this.newEquipmentData.AC_XDIM = inputArray[14];
            this.newEquipmentData.AC_YDim = inputArray[15];
            this.newEquipmentData.AC_ZDim = inputArray[16];
            this.newEquipmentData.ORBIS_XDim = inputArray[17];
            this.newEquipmentData.ORBIS_YDim = inputArray[18];
            this.newEquipmentData.ORBIS_ZDim = inputArray[19];
            this.newEquipmentData.SafeX = inputArray[20];
            this.newEquipmentData.SafeY = inputArray[21];

            dataRequest("/api/equipment/" + this.newEquipmentData.EquipmentID, "PUT", JSON.stringify(this.newEquipmentData))
        },
        // handleChange(event) {
        //     let t = event.target;
        //     newEquipmentData[t.id.split("-input")[0]] = t.value;
        //     if(t.checked) {
        //         newEquipmentData[t.id.split("-input")[0]] = t.checked;
        //     }
        //     this.$parent.drawLayout()
        // },
        // watch: {
        //     equipmentData: function (newVal, oldVal) {
        //         this.newEquipmentData = { ...this.equipmentData }
        //     }
        // }
    }
}
</script>

<style>
.equipment-details {
    margin: 25px;
    padding: 15px;
    background-color: var(--primary-gray);
    border-radius: 10px;
}

.equipment-details input {
    padding: 3px;
    margin: 2px 0 0 10px;
}

.equipment-details .input-container {
    display: flex;
    justify-content: space-between;
}
</style>