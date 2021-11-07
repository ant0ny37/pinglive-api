const dayjs = require('dayjs');
const crypto = require('crypto');

global.serial = null;

login = () => {
    generateSerial();

    let params = {};

    params['serie'] = serial;
    params['id'] = process.env.FFTT_APP_ID;
    params['tm'] = dayjs().unix().toString();
    params['tmc'] = crypto.createHmac('sha1', params['tm'].toString()).update(crypto.createHash('md5').update(process.env.FFTT_APP_KEY).digest("hex")).digest("hex");

    console.log(params);
}

generateSerial = () => {

    if (serial) {
        return serial;
    }

    serial = '';
    for (let i = 0; i < 15; i++) {
        serial += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1) + 65));
    }

    return serial;
}

module.exports = {
    login,
    generateSerial
}