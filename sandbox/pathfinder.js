"use strict";

const paths = {
    btc: ["ltc", "usd"],
    ltc: ["btc", "usd"],
    usd: ["btc", "ltc"]
};
const initial = "btc";


function findPaths(sellCurrency, state) {
    paths[sellCurrency]
        .forEach((el) => {
            let newState = state;
            if (initial === sellCurrency) {
                state[el] = {
                    path: [],
                    currencies: []
                };

                newState = state[el];
            }

            if (typeof newState.path == 'undefined') {
                console.log('undefined?', newState);
                return;
            }
            newState.path.push(sellCurrency + '_' + el);
            newState.currencies.push(el);

            if (initial === el) {
                return;
            }

            if (newState.currencies.indexOf(el)) {
                return;
            }

            findPaths(el, state)
        });
    return this;
}

const finds = {};
findPaths(
    initial,
    finds
);

console.log(finds);