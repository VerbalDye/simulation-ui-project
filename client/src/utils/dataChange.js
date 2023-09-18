// Later convert to beautiful function to handle any data change
const processTimeDataChange = function (mode, { process_time, experiment_process_time_id, operation_id, asset_id }) {
    process_time = parseFloat(process_time);
    operation_id = parseInt(operation_id);
    asset_id = parseInt(asset_id);
    if (mode == "add" && operation_id !== undefined && asset_id !== undefined) {
        if (!process_time) { process_time = 0 }
        let entryIds = this.processTimeData.filter(e => e.process_time.asset_id == asset_id && e.process_time.operation_id == operation_id).map(e => e.experiment_process_time_id);
        let backupTimes = this.backupProcessTimeData.filter(e => e.process_time.asset_id == asset_id && e.process_time.operation_id == operation_id).filter(e => entryIds.indexOf(e.experiment_process_time_id) == -1);
        if (backupTimes.length > 0) {
            let entry = this.processTimeData[this.processTimeData.push(backupTimes[0]) - 1];
            let index = this.changedProcessTimeData.findIndex(e => e.experiment_process_time_id == backupTimes[0].experiment_process_time_id);
            if (index !== -1 && this.changedProcessTimeData[index].method == 'DELETE') {
                if (process_time) {
                    entry.process_time.process_time = process_time;
                    this.changedProcessTimeData[index].method = 'PUT';
                    this.changedProcessTimeData[index].process_time = process_time;
                } else {
                    this.changedProcessTimeData.splice(index, 1);
                }
            } else {
                throw new Error('Adding Entry Failed: No Delete Record Exists');
            }
        } else {
            let id = "new-" + Math.floor(Math.random() * 1000000);
            this.processTimeData.push({
                experiment_process_time_id: id,
                process_time: {
                    process_time: process_time,
                    asset_id: asset_id,
                    operation_id: operation_id
                }
            })
            this.changedProcessTimeData.push({
                process_time: process_time,
                experiment_process_time_id: id,
                asset_id: asset_id,
                operation_id: operation_id,
                iteration_number: 1,
                method: 'POST'
            });
        }
    } else if (mode == "remove" && experiment_process_time_id !== undefined) {
        let data = this.processTimeData.find(e => e.experiment_process_time_id == experiment_process_time_id);
        this.processTimeData.splice(this.processTimeData.findIndex(e => e.experiment_process_time_id == experiment_process_time_id), 1);
        let index = this.changedProcessTimeData.findIndex(e => e.experiment_process_time_id == experiment_process_time_id);
        if (experiment_process_time_id.toString().includes('new')) {
            this.changedProcessTimeData.splice(index, 1);
        } else {
            if (index == -1) {
                this.changedProcessTimeData.push({
                    process_time: 0,
                    experiment_process_time_id: experiment_process_time_id,
                    asset_id: data.process_time.asset_id,
                    operation_id: data.process_time.operation_id,
                    process_time_id: data.process_time_id,
                    iteration_number: data.iteration_number,
                    method: 'DELETE'
                });
            } else {
                this.changedProcessTimeData[index].method = 'DELETE'
            }
        }
    } else if (mode == "change" && process_time !== undefined && experiment_process_time_id !== undefined) {
        let data = this.processTimeData.find(e => e.experiment_process_time_id == experiment_process_time_id);
        data.process_time.process_time = process_time;
        let processTimeEntry = this.changedProcessTimeData.find(e => e.experiment_process_time_id == experiment_process_time_id);
        if (!processTimeEntry) {
            this.changedProcessTimeData.push({
                experiment_process_time_id: experiment_process_time_id,
                asset_id: data.process_time.asset_id,
                operation_id: data.process_time.operation_id,
                process_time: process_time,
                process_time_id: data.process_time_id,
                iteration_number: data.iteration_number,
                method: 'PUT'
            });
        } else {
            processTimeEntry.process_time = process_time;
        }
    } else if (mode == "overwrite" && operation_id !== undefined && asset_id !== undefined) {
        let template = this.processTimeData.filter(e => e.process_time.operation_id == operation_id && e.process_time.asset_id == asset_id);
        let assetIds = this.operationToLocationData.filter(e => e.operation_to_location.operation_id == operation_id).map(e => e.operation_to_location.asset_id);
        assetIds.splice(assetIds.indexOf(asset_id), 1);
        assetIds.forEach(id => {
            this.processTimeData.filter(e => e.process_time.operation_id == operation_id && e.process_time.asset_id == id).forEach(entry => {
                this.processTimeDataChange("remove", { experiment_process_time_id: entry.experiment_process_time_id });
            })
            template.forEach(entry => {
                this.processTimeDataChange("add", { operation_id: operation_id, asset_id: id, process_time: entry.process_time.process_time });
            })
        })
    } else {
        throw new Error('Incorrect Inputs Provided: ' + operation_id + " " + asset_id + " " + experiment_process_time_id + " " + process_time);
    }
}