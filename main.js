"use strict";

const valuablePaths = require('./controllers/ValuablePathsController');

valuablePaths
.then(paths => {
    if (!paths.length) {
        console.log('Nothing found :(');
    }

    console.log('Found optimal paths to trade:');

    let calculator;
    for (let i = 0; i < paths.length; i++) {
        calculator = paths[i];

        console.log(calculator.getDebugLogs());
        console.log(calculator.getBalance());
    }
})
.catch(err => {
    console.error(err);
});