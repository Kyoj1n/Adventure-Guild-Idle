import workerData from './workers.js';



//Get worker data from an outside source
function getWorkerData() {
    if (workerName) {
        //Return specific worker
        return workerData.find(worker => worker.name === workerName);
    } else {
        //Return a random worker
        const randomIndex = Math.floor(Math.random() * workerData.length);
        return workerData[randomIndex];
    }
}

const buildingData = {
    name: 'Saw Mill',
    picture: 'saw-mill.png',

    resource: 'lumber',

    workerSlots: [],

    storage: [
        { current: 0},
        { max: 100},
    ]
}

//Get building data from an outside source
function getBuildingData() {
    // nothing for now
    return [buildingData];
}