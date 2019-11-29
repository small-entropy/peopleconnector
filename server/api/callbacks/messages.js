import buildMeta from '../../helpers/buildMeta';
import answerBuilder from '../../helpers/answerBuilder';
import Message from '../../models/Message';
import defaultErrors from '../../helpers/defaultErrors';
import decodeToken from '../../helpers/decodeToken';
import getToken from '../../helpers/getToken';

/**
 * @function
 * @name getMessageList
 * @description Функция возвращает список сообщений
 * @param {object} req объект запроса 
 * @param {object} res объект ответа
 * @returns {undefined}
 * @exports 
 */
export async function getMessageList(req, res) {
    // Собираем стандартный объект мета-данных
    const meta = buildMeta(req);
    // Получаем данные о пагинации
    const limit = (req.query.limit) ? Number(req.query.limit) : 15;
    const skip = (req.query.skip) ? Number(req.query.skip) : 0;
    const filter = (req.query.filter) ? JSON.parse(req.query.filter) : {};
    const sort = (req.query.sort) ? JSON.parse(req.query.sort) : {};
    // Получаем сообщения и их количество
    try {
        // Получаем список сообщений из БД
        const messages = await Message.find(filter).sort(sort).limit(limit).skip(skip).exec();
        // Получаем общее количество сообщений по фильтру в БД
        const count = await Message.count(filter).exec();
        // Добавляем количество к мета-данным
        meta.total = count; 
        // Возвращаем удачный ответ
        answerBuilder(res, messages, undefined, meta);
    } catch (error) {
        // Возвращаем ответ с ошибкой
        answerBuilder(res, undefined, error, meta, 502);
    }
 }

 /**
 * @function
 * @name createMessage
 * @description Функция, которая создаёт сообщение
 * @param {object} req объект запроса 
 * @param {object} res объект ответа
 * @returns {undefined}
 * @exports 
 */
 export async function createMessage(req, res) {
    // Собираем стандартный объект мета-данных
    const meta = buildMeta(req);
    // Получаем тоекн из запроса
    const token = getToken(req);
    // Получаем текст из тела запроса
    const text = (req.hasOwnProperty('body') && req.body.hasOwnProperty('text'))
        ? req.body.text
        : '';
    // Получаем индефикатор чата из тела запроса
    const chatId = (req.hasOwnProperty('body') && req.body.hasOwnProperty('chatId'))
        ? req.body.chatId
        : undefined;

    try {
        // Декодируем токен пользователя
        const user = await decodeToken(token);
        // Получаем индефикатор пользователя и собираем объект сообщения
        const { _id } = user;
        const author = _id;
        const message = { chatId, text, author };
        const newMesasge = new Message(message);
        // Сохраняем сообщение в БД
        await newMesasge.save();
        // Возвращаем удачный ответ
        answerBuilder(res, newMesasge, undefined, meta);
    } catch (error) {
        // ВОзвращаем ответ с ошибкой
        answerBuilder(res, undefined, error, meta, 502);
    }
 }

 /**
 * @function
 * @name upadateMessage
 * @description Функция, которая обновляет сообщение
 * @param {object} req объект запроса 
 * @param {object} res объект ответа
 * @returns {undefined}
 * @exports 
 */
 export async function upadateMessage(req, res) {
    // Собираем стандартный объект мета-данных
    const meta = buildMeta(req);
    // Получаем данные из запроса
    const id = (req.hasOwnProperty('query') && req.query.hasOwnProperty('id')) 
        ? req.query.id
        : undefined;
    const text = (req.hasOwnProperty('body') && req.body.hasOwnProperty('text')) 
        ? req.body.text 
        : '';
    // Получаем токен из запроса
    const token = getToken(req);

    try {
        // Декодируем токен
        const user = await decodeToken(token);
        // Собираем объект фильтра 
        const filter = { _id: id, author: user._id };
        // Получается сообщение по фильтру
        const message = await Message.findOne(filter);
        // Если сообщение найдено - обновляем данные и
        // возвращаем удачный ответ.
        // Если сообщение не найдено - возвращаем ошибку.
        if (message) {
            message.text = text;
            await message.save();
            answerBuilder(res, message, undefined, meta);
        } else {
            defaultErrors(res, 'NOT_FOUD', meta);
        }
    } catch (error) {
        // Возвращаем ошибку при сбое
        answerBuilder(res, undefined, error, meta, 502);
    }
 }