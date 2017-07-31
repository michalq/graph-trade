"use strict";

const paths = {
    btc: ["ltc", "usd"],
    ltc: ["btc", "usd"],
    usd: ["btc", "ltc"]
};
const initial = "btc";

const foundPaths = [];

function findPaths(sellCurrency, state) {
    paths[sellCurrency]
        .forEach((el) => {
            const newState = JSON.parse(JSON.stringify(state));

            if (-1 !== newState.currencies.indexOf(el)) {
                return;
            }

            newState.path.push(sellCurrency + '_' + el);
            newState.currencies.push(el);

            if (initial === el) {
                foundPaths.push(newState);
                return;
            }

            findPaths(el, newState);
        });

    return foundPaths;
}

findPaths(
    initial,
    {
        path: [],
        currencies: []
    }
);

console.log(foundPaths);