const validators = require('../validators')

module.exports = function(validator) {
    // If validator is not exist, throw err
    if (!validators.hasOwnProperty(validator)) {
        throw new Error(`'${validator}' validator is not exist`)
    }

    return async function(req, res, next) {
        try {
            req.body = await validators[validator].validateAsync(req.body)
            next()
        } catch (err) {
            //! If validation error occurs call next with HTTP 422. Otherwise HTTP 500
            if (err.isJoi) {
                return res.status(422).json({
                    result: false,
                    error: err.message
                });
            }
            next(res.status(500))
        }
    }
}