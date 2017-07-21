"use strict";

/**
 * This file is whole concept.
 */

// Available pairs.
const pairs = {
    "btc_usd": {
        "item": "btc",
        "currency": "usd",
        "price": 2513
    },
    "ltc_usd": {
        "item": "ltc",
        "currency": "usd",
        "price": 42.491916
    },
    "ltc_btc": {
        "item": "ltc",
        "currency": "btc",
        "price": 0.01687
    }
};

// Account balance.
const balance = {
    btc: {
        balance: 0
    },
    usd: {
        balance: 2513
    },
    ltc: {
        balance: 0
    }
};

// Strategy.
const strategy = {
    steps: [
        {
            buy: "btc",
            sell: "usd"
        },
        {
            buy: "ltc",
            sell: "btc"
        },
        {
            buy: "usd",
            sell: "ltc"
        }
    ]
};

// Algorithm.

let currentStrategy,
    price,
    amountToBuy,
    totalPrice;

for (let i = 0; i < strategy.steps.length; i++) {
    currentStrategy = strategy.steps[i];

    // Check price of pair.
    if (pairs[currentStrategy.buy + '_' + currentStrategy.sell]) {
        price = pairs[currentStrategy.buy + '_' + currentStrategy.sell].price;
    } else if (pairs[currentStrategy.sell + '_' + currentStrategy.buy]) {
        price = 1 / pairs[currentStrategy.sell + '_' + currentStrategy.buy].price;
    } else {
        throw new Error('Not defined pair.');
    }

    if (price <= 0) {
        throw new Error('Price cannot be lass or equal 0.');
    }

    // Calculate how many can buy for that price.
    amountToBuy = balance[currentStrategy.sell].balance / price;
    totalPrice = price * amountToBuy;

    balance[currentStrategy.sell].balance -= totalPrice;
    balance[currentStrategy.buy].balance += amountToBuy;

    console.info(
        'Buying ' + amountToBuy + '[' + currentStrategy.buy + '] for ' + totalPrice + '[' + currentStrategy.sell + ']'
    );
}

console.log(
    'Results',
    balance
);