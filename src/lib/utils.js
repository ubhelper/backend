const crypto = require('crypto');
const { resolve } = require('path');

const isEmpty = (value) => {
    if(typeof value == "undefined"
        || value == null
        || value === ""
        || (value != null && typeof value === "object" && !Object.keys(value).length)
        || (value != null && Array.isArray(value) && value.length === 0)){
        return true;
    } else {
        return false;
    }
}
const findProp = (obj, targetKey) => {
    const t = String(targetKey).toLowerCase();
    for (const objectKey in obj) {
        if(obj.hasOwnProperty(objectKey)) {
            const o = String(objectKey).toLowerCase();
            if(o === t && !isEmpty(obj[objectKey])){
                return obj[objectKey];
            }
        }
    }
    return null;
}

const copyObject = (inObject) => {
    if(typeof inObject !== "object" || inObject === null){
        return inObject;
    }

    let outObject = Array.isArray(inObject) ? [] : {}
    for (const key in inObject) {
        const value = inObject[key];
        outObject[key] = (typeof value === "object" && value !== null) ? copyObject(value) : value;
    }

    return outObject;
}

const getDifferObject = ( prev, now, keyData = [] ) => {
    let differObject = {};

    const keys = Object.keys(prev);

    for (const key of keys) {
        if(keyData.includes(key)){
            differObject[key] = prev[key];
            continue;
        }

        if(prev[key] != now[key]){
            differObject[key] = now[key];
        }
    }
    return differObject;
}

const makePasswordHashed = (plainPassword, salt) => {
    return new Promise((resole, reject) => {
        crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
            if(err) reject(err);
            resolve(key.toString('base64'));
        });
    });
}

const createSalt = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if(err) reject(err);
            resolve(buf.toString('base64'));
        });
    });
}

module.exports = {
    isEmpty,
    findProp,
    copyObject,
    getDifferObject,
    makePasswordHashed,
    createSalt,
}