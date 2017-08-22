const Currency = require('./Currency');

class Currencies {
    constructor() {
        this.currencies = {};
        this.feeder();
    }

    get(currencyName) {
        if (typeof this.currencies[currencyName] === 'undefined') {
            throw new Error('Currency ' + currencyName + ' not found.');
        }

        return this.currencies[currencyName];
    }

    /**
     * @return {boolean}
     */
    feeder() {
        const tmp = {
            usd: { name: 'usd', decimalPlaces: 2 },
            cny: { name: 'cny', decimalPlaces: 2 },
            btc: { name: 'btc', decimalPlaces: 8 },
            ltc: { name: 'ltc', decimalPlaces: 8 },
            xrp: { name: 'xrp', decimalPlaces: 8 },
            bcc: { name: 'bcc', decimalPlaces: 8 },
            qtum: { name: 'qtum', decimalPlaces: 8 },
            etp: { name: 'etp', decimalPlaces: 8 },
            bts: { name: 'bts', decimalPlaces: 8 },
            cnc: { name: 'cnc', decimalPlaces: 8 },
            rep: { name: 'rep', decimalPlaces: 8 },
            bat: { name: 'bat', decimalPlaces: 8 },
            snt: { name: 'snt', decimalPlaces: 8 },
            btm: { name: 'btm', decimalPlaces: 8 },
            omg: { name: 'omg', decimalPlaces: 8 },
            pay: { name: 'pay', decimalPlaces: 8 },
            ico: { name: 'ico', decimalPlaces: 8 },
            cvc: { name: 'cvc', decimalPlaces: 8 },
            storj: { name: 'storj', decimalPlaces: 8 },
            eos: { name: 'eos', decimalPlaces: 8 },
            doge: { name: 'doge', decimalPlaces: 8 },
            dash: { name: 'dash', decimalPlaces: 8 },
            eth: { name: 'eth', decimalPlaces: 8 },
            etc: { name: 'etc', decimalPlaces: 8 },
            ftc: { name: 'ftc', decimalPlaces: 8 },
            ifc: { name: 'ifc', decimalPlaces: 8 },
            nmc: { name: 'nmc', decimalPlaces: 8 },
            nxt: { name: 'nxt', decimalPlaces: 8 },
            ppc: { name: 'ppc', decimalPlaces: 8 },
            shell: { name: 'shell', decimalPlaces: 8 },
            tips: { name: 'tips', decimalPlaces: 8 },
            tix: { name: 'tix', decimalPlaces: 8 },
            xcp: { name: 'xcp', decimalPlaces: 8 },
            xmr: { name: 'xmr', decimalPlaces: 8 },
            xpm: { name: 'xpm', decimalPlaces: 8 },
            xtc: { name: 'xtc', decimalPlaces: 8 },
            hkg: { name: 'hkg', decimalPlaces: 8 },
            xcn: { name: 'xcn', decimalPlaces: 8 },
            xem: { name: 'xem', decimalPlaces: 8 },
            mg: { name: 'mg', decimalPlaces: 8 },
            zec: { name: 'zec', decimalPlaces: 8},
            ven: { name: 'ven', decimalPlaces: 8},
            doc: { name: 'doc', decimalPlaces: 8},
            oax: { name: 'oax', decimalPlaces: 8},
        };

        for (let currency in tmp) {
            this.currencies[currency] = new Currency(tmp[currency]);
        }

        return true;
    }
}

module.exports = Currencies;