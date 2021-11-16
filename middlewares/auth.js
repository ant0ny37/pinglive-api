const fftt = require("./../services/fftt.service");

module.exports.authenticate = async (req, res, next) => {
    try {
        await fftt.login();
        next();
    }
    catch (error) {
        res.status(401).json({"result": false});
    }
};