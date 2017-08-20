const PairsCollection = require('./Pairs'),
    Currencies = require('./Currencies'),
    PairEntity = require('./Pair'),
    RelationsCollection = require('./Relations');

/**
 *
 */
class PairsHelper {
    constructor(apiMarketInfo, apiTickers) {
        this.apiMarketInfo = apiMarketInfo;
        this.apiTickers = apiTickers;

        this.relationsCollection = new RelationsCollection;
        this.pairsCollection = new PairsCollection;
    }

    /**
     * @return this
     */
    findPairs() {
        const currencies = new Currencies();
        for (let i = 0; i < this.apiMarketInfo.length; i++) {
            let pairName = Object.keys(this.apiMarketInfo[i])[0],
                pairDetails = this.apiMarketInfo[i][pairName],
                ticker = this.apiTickers[pairName];

            if (typeof ticker === 'undefined') {
                console.log('Omitting ticker for pair ' + pairName + ' is undefined.');
                continue;
            }

            let buyCurrency = ticker.getBuyCurrency(),
                sellCurrency = ticker.getSellCurrency(),
                sellPrice = ticker.getSell(),
                buyPrice = ticker.getBuy();

            this.relationsCollection.addRelation(
                buyCurrency,
                sellCurrency
            );

            this.relationsCollection.addRelation(
                sellCurrency,
                buyCurrency
            );

            this.pairsCollection.addPair((new PairEntity)
                .setTicker(ticker)
                .setBuyCurrency(currencies.get(buyCurrency))
                .setSellCurrency(currencies.get(sellCurrency))
                .setPrice(buyPrice)
                .setDecimalPlaces(pairDetails.decimal_places)
                .setFeePercent(pairDetails.fee)
            );

            this.pairsCollection.addPair((new PairEntity)
                .setTicker(ticker)
                .setBuyCurrency(currencies.get(sellCurrency))
                .setSellCurrency(currencies.get(buyCurrency))
                .setPrice(1 / sellPrice)
                .setDecimalPlaces(pairDetails.decimal_places)
                .setFeePercent(pairDetails.fee)
            );
        }
    }

    /**
     * @return {PairsCollection}
     */
    getPairs() {
        return this.pairsCollection;
    }

    /**
     * @return {RelationsCollection}
     */
    getRelations() {
        return this.relationsCollection;
    }
}

module.exports = PairsHelper;