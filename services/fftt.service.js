const dayjs = require('dayjs');
const crypto = require('crypto');
const axios = require("axios");
const parser = require("fast-xml-parser");

global.serial = null;

login = () => {
    return new Promise((resolve, reject) => {

        generateSerial();

        if (!process.env.FFTT_API_URL_V2 || !process.env.FFTT_APP_ID || !process.env.FFTT_APP_KEY) {
            reject("Invalid APP_ID or APP_KEY");
        }

        let params = {};
        let key = crypto.createHash('md5').update(process.env.FFTT_APP_KEY).digest('hex');

        params['serie'] = serial;
        params['id'] = process.env.FFTT_APP_ID;
        params['tm'] = dayjs().format('YYYYMMDDHHmmssSSS').toString();
        params['tmc'] = crypto.createHmac('sha1', key).update(params['tm']).digest('hex');

        let urlParams = new URLSearchParams({
            serie: params['serie'],
            id: params['id'],
            tm: params['tm'],
            tmc: params['tmc']
        });

        console.log(params['tm']);

        console.log("[FFTT API] API Call :", process.env.FFTT_API_URL_V2 +'/xml_initialisation.php?'+ urlParams.toString());
        axios.get(process.env.FFTT_API_URL_V2 +'/xml_initialisation.php?'+ urlParams.toString()).then((response) => {
            console.log("[FFTT API] API Response : \n", response.data);

            if (!response.data) {
                reject("Bad response from API");
            }

            let output = parser.parse(response.data);
            if (output.initialisation.appli !== 1) {
                reject("Invalid credentials");
            }

            console.log("[FFTT API]", "Login OK");
            resolve();
        }).catch((error) => {
            console.log("[FFTT API] API Response : \n", error.response.data);
            reject(error.response);
        });
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