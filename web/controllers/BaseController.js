
class BaseController
{
    constructor(req, res) {
        this.res = res;
        this.req = req;
    }

    /**
     * @param {Object} msg
     */
    displayOk(msg) {
        this.res.statusCode = 200;
        this.res.json();
    }

    /**
     *
     * @param  {String} msg [description]
     */
    http500(msg) {
        this.res.statusCode = 500;
        this.res.json(this.getErrorPayload(msg, this.res.statusCode));
    }

    /**
     * Displays internal error page.
     *
     * @param  {Mixed} msg
     */
    displayInternalError(msg) {
        this.res.statusCode = 500;
        this.res.json(this.getErrorPayload(msg, this.res.statusCode));
    }

    /**
     * Bad Request.
     *
     * @param  {String} msg [description]
     */
    displayBadRequest(msg) {
        this.res.statusCode = 400;
        this.res.json(this.getErrorPayload(msg, this.res.statusCode));
    }

    /**
     * Not found.
     *
     * @param  {String} msg [description]
     */
    displayNotFound(msg) {
        this.res.statusCode = 404;
        this.res.json(this.getErrorPayload(msg, this.res.statusCode));
    }

    getErrorPayload(msg, httpCode) {
        if (typeof msg == 'string') {
            return {
                success: false,
                code: httpCode,
                error: {
                    message: msg
                }
            }
        }

        return {
            success: false,
            code: httpCode,
            errors: msg
        };
    }
}

module.exports = BaseController;