import answerBuilder from '../../helpers/answerBuilder';

/**
 * @function
 * @name checkHealth
 * @description Функция, возвращает ответ, если сервер работает
 * @param {object} req объект запроса
 * @param {object} res объект ответа
 * @returns
 * @export
 */
export function checkHealth(req, res) {
    const message = 'Health check';
    const meta = { message };
    answerBuilder(res, undefined, undefined, meta);
}