const { addMinutes } = require('date-fns');

const globalState = {
    isRunning: true,
    startTime: new Date('2024-09-28T10:15:00+05:30'),
    endTime: new Date('2024-09-28T01:15:00+05:30'),
}

module.exports = {
    start: () => {
        globalState.isRunning = true;
    },
    stop: () => {
        globalState.isRunning = false;
    },
    isRunning: () => {
        return globalState.isRunning;
    },
    getStartTime: () => {
        return globalState.startTime;
    },
    getEndTime: () => {
        return globalState.endTime;
    },
    extendEndTime: minutes => {
        globalState.endTime = addMinutes(globalState.endTime, minutes);
        return globalState.endTime;
    },
    setStartTime: time => {
        globalState.startTime = time;
    },
};
