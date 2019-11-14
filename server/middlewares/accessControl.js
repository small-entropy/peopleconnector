import getToken from '../helpers/getToken';
import buildMeta from '../helpers/buildMeta';
import decodeToken from '../helpers/decodeToken';
import defaultErrors from '../helpers/defaultErrors';

/**
 * @function
 * @name accessControl
 * @description Middleware function for access control
 * @param {object} req request express object 
 * @param {object} res responce express object
 * @param {Function} next next function
 * @export
 * @async
 */
export default async function accessControl(req, res, next) {
    const token = getToken(req);
    const whiteList = ['login', 'register', 'health'];
    const url = req.originalUrl;

    let inWhiteList = false;

    whiteList.forEach(whiteUrl => {
        if (url.indexOf(whiteUrl) !== -1) {
            inWhiteList = true;
        }
    });

    const meta = buildMeta(req);
    
    if (inWhiteList) {
        next();
    } else {
        if (token) {
            try {
                await decodeToken(token);
                next();
            } catch (error) {
                defaultErrors(res, 'WRONG_TOKEN', meta);                
            }
        } else {
            defaultErrors(res, 'NOT_AUTH', meta);
        }
    }
}