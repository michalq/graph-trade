"use strict";

const InfoService = require('../modules/btceClient/Info'),
    TickerService = require('../modules/btceClient/Ticker'),
    PairsCollection = require('./app/Pairs'),
    RelationsCollection = require('./app/Relations'),
    PairEntity = require('./app/Pair'),
    PathFinder = require('./app/PathFinder'),
    Calculator = require('./app/Calculator');


let pairsCollection = new PairsCollection;
let relationsCollection = new RelationsCollection;

InfoService.fetch()
    .then((data) => {
        let tickersPromises = [];
        let i = 0;
        for (let pairName in data.pairs) {
            tickersPromises[i] = TickerService.fetch(pairName);
            tickersPromises[i].then((ticker) => {
                const pairDetails = data.pairs[ticker.getPairName()];

                relationsCollection.addRelation(
                    ticker.getBuyCurrency(),
                    ticker.getSellCurrency()
                );

                relationsCollection.addRelation(
                    ticker.getSellCurrency(),
                    ticker.getBuyCurrency()
                );

                pairsCollection.addPair((new PairEntity)
                    .setBuyCurrency(ticker.getBuyCurrency())
                    .setSellCurrency(ticker.getSellCurrency())
                    .setPrice(ticker.getBuy())
                    .setDecimalPlaces(pairDetails.decimal_places)
                    .setFeePercent(pairDetails.fee)
                );

                pairsCollection.addPair((new PairEntity)
                    .setBuyCurrency(ticker.getSellCurrency())
                    .setSellCurrency(ticker.getBuyCurrency())
                    .setPrice(1 / ticker.getSell())
                    .setDecimalPlaces(pairDetails.decimal_places)
                    .setFeePercent(pairDetails.fee)
                );
            })
            .catch((err) => {
                console.error(err);
            });

            i++;
        }

        return Promise.all(tickersPromises);
    })
    .then((data) => {
        const pathFinder = new PathFinder(relationsCollection);
        pathFinder.setInitial('btc');
        pathFinder.setDestination('btc');
        pathFinder.findPaths();

        const calculator = new Calculator(pairsCollection, pathFinder.getPaths()[0]);

        console.log(relationsCollection.getRelation('btc').getBuyPossibilities());
    })
    .catch((err) => {
        console.error(err);
    });