"use strict";

const InfoService = require('../modules/btceClient/Info'),
    TickerService = require('../modules/btceClient/Ticker'),
    PairsCollection = require('./app/Pairs'),
    PairEntity = require('./app/Pair');

InfoService.fetch()
    .then((data) => {
        let currencies;
        let pairsCollection = new PairsCollection;
        let pairDetails;
        for (let pairName in data.pairs) {
            currencies = pairName.split('_');
            pairDetails = data.pairs[pairName];

            pairsCollection.addPair((new PairEntity)
                .setBuyCurrency(currencies[0])
                .setSellCurrency(currencies[1])
                .setPrice(null)
                .setDecimalPlaces(pairDetails.decimal_places)
            );

            pairsCollection.addPair((new PairEntity)
                .setBuyCurrency(currencies[1])
                .setSellCurrency(currencies[0])
                .setPrice(null)
                .setDecimalPlaces(pairDetails.decimal_places)
            );
        }

        // console.log(data);
    })
    .catch((err) => {
        console.log(err);
    });