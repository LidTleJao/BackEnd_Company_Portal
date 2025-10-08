const crypto = require('crypto');

const key = Buffer.from(process.env.FIELD_CRYPTO_KEY || '', 'base64');
const ivSalt = Buffer.from(process.env.FIELD_CRYPTO_IV_SALT || '', 'base64');

function encrypt(text: string) {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, ivSalt);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
};

function decrypt(encryptedText: string) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, ivSalt);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

module.exports = {
    encrypt,
    decrypt,
};