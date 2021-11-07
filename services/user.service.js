const crypto = require('crypto');
const Customer = require('../models/customers/Customer');

exports.name = () => require("path").basename(__filename)
/**
 *
 * @param email
 * @param password
 * @returns {Promise<unknown>}
 */
exports.getUserByEmailPassword = (email, password) => {
    return new Promise((resolve, reject) => {
        console.time("getUserByEmailPassword");
        let encodedPassword = crypto.createHash('sha1').update(password, 'utf-8').digest('hex');

        Customer.query()
            .select(['customer_id'])
            .where('email', email)
            .andWhere('password', encodedPassword)
            .first()
            .then((user) => {
                console.timeEnd("getUserByEmailPassword");
                resolve(user);
            }).catch((error) => {
                console.timeEnd("getUserByEmailPassword");
                reject(error);
            });
    });
}