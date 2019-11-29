/**
 * @function
 * @name getToken
 * @description Функция, которая получает токен из запроса
 * @param {object} req объект запроса
 * @returns {string} строка токена
 * @export 
 */
export default function getToken(req) {
    let token;
    const hasInHeaders = req.header('Authorization');
    const hasInBody = (req.body.hasOwnProperty('token'));
    if (hasInHeaders) {
        token = req.header('Authorization');
    } else if (hasInBody) {
        token = req.body.token;
    } else {
        token = undefined;
    }
    return token;
}