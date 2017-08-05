/**
 *
 */
class PriceLeqZero extends Error {
    constructor(message, fileName, lineNumber) {
        if (typeof message == 'object') {
            message = "Price is less or equal zero. "
                + "Price: " + message.getPrice() + ", "
                + "pair: " + message.getName();
        }

        super(message, fileName, lineNumber);
    }
}

module.exports = PriceLeqZero;