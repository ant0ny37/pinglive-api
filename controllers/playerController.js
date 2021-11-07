const fftt = require('./../services/fftt.service');

const getByLicense = (req, res, next) => {

    let license = req.params.license;

    res.status(200).json({"result": true});
};

module.exports = {
    getByLicense
}