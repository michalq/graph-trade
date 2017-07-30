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
            if (initial === sellCurrency) {
                state[el] = {
                    path: [],
                    currencies: []
                };

                state = state[el];
            }

            state.path.push(sellCurrency + '_' + el);
            state.currencies.push(el);

            if (initial === el) {
                return;
            }

            if (state.currencies.indexOf(el)) {
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