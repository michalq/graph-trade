/**
 *
 */
class PairNotDefinedError extends Error {
    constructor(message, fileName, lineNumber) {
        message = 'Pair [' + message + '] is not defined.';
        super(message, fileName, lineNumber)
    }
}

module.exports = PairNotDefinedError;