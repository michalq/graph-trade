"use strict";

const InfoService = require('../modules/btceClient/Info'),
    PairsCollection require('./app/Pairs');

InfoService.fetch()
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.log(err);
    });