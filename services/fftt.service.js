const dayjs = require('dayjs');
const crypto = require('crypto');
const axios = require("axios");
const parser = require("fast-xml-parser");

global.serial = null;

login = async () => {
    generateSerial();

    let params = {};

    params['serie'] = serial;
    params['id'] = process.env.FFTT_APP_ID;
    params['tm'] = dayjs().format('YYYYMMDDHHmmssSSS').toString();
    params['tmc'] = crypto.createHmac('sha1', params['tm'].toString()).update(crypto.createHash('md5').update(process.env.FFTT_APP_KEY).digest('hex')).digest('hex');

    let urlParams = new URLSearchParams({
        serie: params['serie'],
        id: params['id'],
        tm: params['tm'],
        tmc: params['tmc']
    });

    axios.get(process.env.FFTT_API_URL_V2 +'/xml_initialisation.php?'+ urlParams.toString()).then((response) => {
        if (!response.data) {
            throw "Bad response from API";
        }

        let output = parser.parse(response.data);
        if (output.initialisation.appli !== 1) {
            throw "Invalid credentials";
        }

        return true;
    }).catch((error) => {
        console.log(error);
        throw error;
    });
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