const dayjs = require('dayjs');
const crypto = require('crypto');
const axios = require("axios");
const parser = require("fast-xml-parser");
const {response} = require("express");

global.serial = null;

login = () => {
    return new Promise((resolve, reject) => {

        call('xml_initialisation').then((response) => {
            if (response.initialisation.appli !== 1) {
                reject("Invalid credentials");
            }

            console.log("[FFTT API]", "Login OK");
            resolve();
        }).catch((error) => {
            reject(parser.parse(error.response.data));
        });
    });
}

getByLicense = (license) => {


}

/**
 * Generate serial number
 *
 * @returns {string}
 */
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

call = (endpoints, params = {}, hash = true) => {

    return new Promise((resolve, reject) => {
        if (!endpoints) {
            reject("Missing parameter 'endpoint'");
        }
        if (!process.env.FFTT_API_URL_V2 || !process.env.FFTT_APP_ID || !process.env.FFTT_APP_KEY) {
            reject("Invalid APP_ID or APP_KEY");
        }

        try {
            generateSerial();

            let params = {};
            let key = crypto.createHash('md5').update(process.env.FFTT_APP_KEY).digest('hex');

            params['serie'] = serial+'ff';
            params['id'] = process.env.FFTT_APP_ID;
            params['tm'] = dayjs().format('YYYYMMDDHHmmssSSS').toString();
            params['tmc'] = crypto.createHmac('sha1', key).update(params['tm']).digest('hex');

            let urlParams = new URLSearchParams({
                serie: params['serie']+'f',
                id: params['id'],
                tm: params['tm'],
                tmc: params['tmc']+'e',
                ...params
            });

            let url = process.env.FFTT_API_URL_V2 +'/'+ endpoints +'.php?'+ urlParams.toString();

            console.debug("[FFTT API] API Call :", url);
            axios.get(url).then((response) => {
                console.debug("[FFTT API] API Response :", response.data);

                if (!response.data) {
                    reject("Bad response from API");
                }

                resolve(parser.parse(response.data));
            }).catch((error) => {
                console.log("[FFTT API] API Error : \n", error.response.data);
                reject(error);
            });
        }
        catch (error) {
            console.error(error);
            reject(error);
        }
    });

}

module.exports = {
    login,
    generateSerial
}