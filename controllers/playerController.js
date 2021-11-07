const fftt = require('./../services/fftt.service');

const getByLicense = (req, res, next) => {

    let license = req.params.license;
    console.log(license);

    next();
};

module.exports = {
    getByLicense
}