import getToken from './getToken';

/**
 * @function
 * @name buildMeta
 * @description Функция собирает стандартный ответ по данным запроса
 * @param {object} req объект запроса
 * @returns {object} стандартный объект мета-данных
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