const uuid = require('uuid');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const AuthSecret = require('../models/customers/AuthSecret');
const AuthToken = require('../models/customers/AuthToken');
const { transaction, raw } = require('objection');

const TOKEN_TYPE_AUTH = 'auth';

exports.name = () => require("path").basename(__filename)

exports.getSecretKey = () => {
    return new Promise((resolve, reject) => {
        console.time("getSecretKey");

        AuthSecret.query().where('is_active', '=', 1).orderBy('created_at', 'desc').first(['id', 'key', 'secret']).then((secret) => {
            console.timeEnd("getSecretKey");
            resolve(secret);
        }).catch((err) => {
            console.timeEnd("getSecretKey");
            console.log(err);
            reject('Unable to get secret key');
        });
    });
}

exports.generateSecretKey = async () => {
    try {
        let key = uuid.v4();

        return await AuthSecret.query().insert({
            key: key,
            secret: crypto.createHash('sha256').update(key).digest('hex'),
            is_active: 1,
            total: 0
        });
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

exports.disableSecretKeys = async () => {
    try {
        return await AuthSecret.query().where('is_active', 0).update({
            is_active: 0,
            stopped_at: new Date()
        });
    }
    catch (err) {
        return false;
    }
}

exports.generateJWT = (customer_id, secret) => {
    return new Promise((resolve, reject) => {

        console.time("generateJWT");
        try {
            if (!customer_id || !secret) {
                throw "Missing parameter";
            }

            let token = jwt.sign({
                customer_id: customer_id,
                secret_id: secret.key,
                created_at: Date.now()
            }, secret.secret, {
                expiresIn: '1y',
                algorithm: 'HS256'
            });

            console.timeEnd("generateJWT");
            resolve(token);
        }
        catch (error) {
            console.timeEnd("generateJWT");
            reject(error);
        }
    });
}

exports.saveJWT = (params) => {

    return new Promise((resolve, reject) => {
        console.time("saveJWT");

        let promises = [];

        return AuthToken.transaction((transaction) => {
            promises.push(AuthToken.query(transaction).insert({
                customer_id: params.customer_id,
                secret_id: params.secret_id,
                token: params.token,
                type: TOKEN_TYPE_AUTH,
                user_agent: params.userAgent,
                ip_address: params.ipAddress,
                origin: params.origin,
                location: params.location,
                is_active: 1
            }));

            promises.push(AuthSecret.query(transaction).where('id', params.secret_id).update({
                total: raw('total + 1'),
                last_at: new Date(),
            }));

            Promise.all(promises).then(function () {
                transaction.commit();
                console.timeEnd("saveJWT");
                resolve(true);
            }).catch((error) => {
                console.log(error);
                transaction.rollback();
                console.timeEnd("saveJWT");
                reject("Unable to create auth token");
            });
        });
    });
}

exports.getJWT = (token) => {
    return new Promise((resolve, reject) => {
        console.time("getJWT");
        if (!token) {
            reject("Missing parameter");
        }

        AuthToken.query().withGraphJoined('secret').withGraphJoined('customer').where('auth_token.token', token).select(['auth_token.token', 'auth_token.customer_id', 'auth_token.is_active']).first().then((model) => {
            console.timeEnd("getJWT");
            resolve(model);
        }).catch((err) => {
            console.timeEnd("getJWT");
            console.log(err);
            reject('Unable to get token');
        });
    });
}