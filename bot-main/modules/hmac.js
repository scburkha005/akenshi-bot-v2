const crypto = require('crypto');

const createHmac = (secret, message) => {
    return crypto.createHmac('sha256', secret)
        .update(message)
        .digest('hex');
}

const verifySignatures = (hmacSig, twitchSig) => {
    return crypto.timingSafeEqual(Buffer.from(hmacSig), Buffer.from(twitchSig));
}

module.exports = {
    createHmac,
    verifySignatures
}