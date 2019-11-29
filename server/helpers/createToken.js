import jwt from 'jsonwebtoken';
/**
 * @function
 * @name createToken
 * @description Функция, которая возвращает JWT
 * @param {object} data объект данных, которые надо зашить в JWT
 * @returns {Promise<string>} сгенеренный JWT
 * @exports 
 */
export default async function createToken(data) {
    return await jwt.sign({ ...data }, process.env.SALT);
}