/**
 * @function
 * @name getToken
 * @param {object} req request express object
 * @returns {string} token from request object
 * @export 
 */
export default function getToken(req) {
    return (req.header('Authorization'))
       ? req.header('Authorization')
       : req.body.token;
}