//Data creation and manipulation

const workerData = {
    name: 'Will the Worker',
    picture: 'will.png',
    skills: [
        { name: 'Working time', level: 5},
        { name: 'Overtime', level: 2},
    ],
    stats: [
        { name: 'Work Speed', value: 1},
    ],
    abilities: ['Can do anything', 'Reliable'],
};

//Get worker data from an outside source
function getWorkerData() {
    // nothing for now
    return [workerData];
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