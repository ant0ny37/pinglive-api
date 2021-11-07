const Memcached = require('memcached');
const env = process.env.ENVIRONMENT

const memcached = new Memcached(process.env.HOST_CREDENTIALS);

exports.getCredentials = (key) => {
    return new Promise((resolve, reject) => {

        const s_key = `ptech_${env}_${key}`;

        memcached.get(s_key, function (err, data) {
            if(err){
               reject(err)
            }
            if(data){
               data = JSON.parse(data)
            }
            resolve(data)
        })
    })
}

