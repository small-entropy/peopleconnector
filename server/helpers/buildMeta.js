import getToken from './getToken';

/**
 * @function
 * @name buildMeta
 * @description Function for bouild default meta object
 * @param {object} req request express object
 * @returns {object} default meta object
 * @export
 */
export default function buildMeta(req) {
    const token = getToken(req);

    return {
        uri: req.originalUrl,
        method: req.method,
        token
    };
}