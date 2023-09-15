class csvJson {
    async CSVtoJson(file) {
        let csv = await file.text();
        const rows = csv.toString().replaceAll("\n", "").split("\r");
        let result = [];
        let headers = rows[0].split(",");
        for (let i = 1; i < rows.length - 1; i++) {
            let obj = {};
            let str = rows[i];
            let s = '';
            let flag = 0;
            for (let ch of str) {
                if (ch === '"' && flag === 0) {
                    flag = 1;
                }
                else if (ch === '"' && flag == 1) flag = 0
                if (ch === ',' && flag === 0) ch = '|'
                if (ch !== '"') s += ch
            }
            let properties = s.split("|");
            for (let j in headers) {
                // if (properties[j].includes(", ")) {
                //     obj[headers[j]] = properties[j]
                //         .split(", ").map(item => item.trim())
                // } else {
                    obj[headers[j]] = properties[j];
                // }
            }
            result.push(obj);
        }
        return result;
    }
    jsonToCSV(objRows) {
        let rows = typeof objRows != 'object' ? JSON.parse(objRows) : objRows;
        let str = '';

        for (let i = 0; i < rows.length; i++) {
            let line = '';
            for (let index in rows[i]) {
                if (line != '') line += ','

                line += rows[i][index];
            }

            str += line + '\r\n';
        }

        return str;
    }
    downloadCSVFile(headers, items, fileTitle) {
        if (headers) {
            items.unshift(headers);
        }

        // Convert Object to JSON
        let jsonObject = JSON.stringify(items);

        let csv = this.jsonToCSV(jsonObject);

        let exportedFilename = fileTitle + '.csv' || 'export.csv';

        let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, exportedFilename);
        } else {
            let link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                let url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", exportedFilename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }
    downloadJSONDataAsCSV(data, fileName) {
        let keys = Object.keys(data[0])
        let headers = {}
        console.log(keys);
        keys.forEach(key => {
            headers[key] = key;
        });
        console.log(headers);
        this.downloadCSVFile(headers, data, fileName);
    }
}

export default new csvJson();