const fftt = require("./../services/fftt.service");

module.exports.authenticate = async (req, res, next) => {
    try {
        fftt.login()
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({"result": false, "error": "Unauthorized"});
    }
};