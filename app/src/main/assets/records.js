errorTab = document.getElementById('error');
timeTab = document.getElementById('time');
tableByTime = document.getElementById('content_time');
tableByError = document.getElementById('content_error');
btnClear = document.getElementById('btn_clear');

function clearTable() {
    tableByTime.innerHTML =
        `<tr>
            <th></th>
            <th>Nome</th>
            <th>Menor tempo</th>
        </tr>`;
    tableByError.innerHTML = `
    <tr>
        <th></th>
        <th>Nome</th>
        <th>Erros</th>
    </tr>`;
    localStorage.clear();
}

errorTab.onclick = errorTabClick;
function errorTabClick(){
    errorTab.style.borderBottom = 'solid 1px';
    tableByTime.style.display = 'none';
    tableByError.style.display = 'table';
    timeTab.style.borderBottom = '';

}

timeTab.onclick = tabClick;
function timeTabClick(){
    timeTab.style.borderBottom = 'solid 1px';
    tableByError.style.display = 'none';
    tableByTime.style.display = 'table';
    errorTab.style.borderBottom = '';
}

(function() {
    timeTab.style.borderBottom = 'solid 1px';
    tableByError.style.display = 'none';
    if (localStorage.records == null) {
        return;
    }

    let recordsDict = JSON.parse(localStorage.records);
    records = []

    Object.keys(recordsDict).forEach(function(key,index) {
        recordsDict[key].name = key;
        records.push(recordsDict[key]);
    });

    records.sort(function(a,b)  {
        if (a.time < b.time)
        return -1;
        if (a.time > b.time)
        return 1;
        return 0;
    });

    let i = 0;
    records.forEach(record => {
        timerText = '';
        minutes = 0;
        let y=60;
        for(; y<=record.time; y+=60) {
            minutes++;
        }
        seconds = record.time - y + 60;
        if (minutes < 10) {
            timerText = '0';
        }
        timerText += minutes + ':';
        if (seconds < 10) {
                timerText += '0';
        }
        timerText += seconds;
        tableByTime.innerHTML +=
        `<tr>
            <td>${++i}º</td>
            <td>${record.name}</td>
            <td>${timerText}</td>
        </tr>`;
    });

    records.sort(function(a,b)  {
        if (a.errorCount < b.errorCount)
        return -1;
        if (a.errorCount > b.errorCount)
        return 1;
        return 0;
    });

    i = 0;
    records.forEach(record => {
            tableByError.innerHTML +=
        `<tr>
            <td>${++i}º</td>
            <td>${record.name}</td>
            <td>${record.errorCount}</td>
        </tr>`;
    });
})();