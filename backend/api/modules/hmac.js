import crypto from 'crypto';

export const createHmac = (secret, message) => {
    return crypto.createHmac('sha256', secret)
        .update(message)
        .digest('hex');
}

export const verifySignatures = (hmacSig, twitchSig) => {
    return crypto.timingSafeEqual(Buffer.from(hmacSig), Buffer.from(twitchSig));
}