const fftt = require("./../services/fftt.service");
const utf8 = require("utf8");

module.exports.authenticate = async (req, res, next) => {
    try {
        await fftt.login();
        next();
    }
    catch (error) {
        res.status(error.erreurs.code).json({"result": false, "error": unescape(encodeURIComponent(error.erreurs.erreur))});
    }
};