import buildMeta from '../../helpers/buildMeta';
import answerBuilder from '../../helpers/answerBuilder';
import Chat from '../../models/Chat';
import defaultErrors from '../../helpers/defaultErrors';
import decodeToken from '../../helpers/decodeToken';
import getToken from '../../helpers/getToken';

/**
 * @function
 * @name getChatsList
 * @description Функция получения списка чатов
 * @param {object} req объект запроса
 * @param {object} res объект ответа
 * @returns {undefined}
 * @exports 
 */
export async function getChatsList(req, res) {
    // Получаем объект мета-данных
    const meta = buildMeta(req);
    // Получаем данные для пагинации и сортировки
    const limit = (req.query.limit) ? Number(req.query.limit) : 15;
    const skip = (req.query.skip) ? Number(req.query.skip) : 0;
    const filter = (req.query.filter) ? JSON.parse(req.query.filter) : {};
    const sort = (req.query.sort) ? JSON.parse(req.query.sort) : {};
    // Пытаемся получить чаты и их количество
    try {
        // Получаем чаты
        const chats = await Chat.find(filter).sort(sort).limit(limit).skip(skip).exec();
        // Получаем количество чатов
        const count = await Chat.count(filter).exec();
        // Записываем количество в мета-данные
        meta.total = count; 
        // Возвращаем ответ
        answerBuilder(res, chats, undefined, meta);
    } catch (error) {
        // Возвращаем ответ с ошибкой
        answerBuilder(res, undefined, error, meta, 502);
    }
 }

/**
 * @function
 * @name createChat
 * @description Функция, которая создаёт чат
 * @param {object} req объект запроса 
 * @param {object} res объект ответа
 * @returns {undefined}
 * @exports 
 */
 export async function createChat(req, res) {
    // Собирает объект с мета-данными
    const meta = buildMeta(req);
    // Получаем токен из запроса
    const token = getToken(req);
    // Выделяем данные из запроса
    const name = (req.hasOwnProperty('body') && req.body.hasOwnProperty('name'))
        ? req.body.name
        : `чат от ${(new Date).toLocaleTimeString()}`;
    const description = (req.hasOwnProperty('body') && req.body.hasOwnProperty('description')) 
        ? req.body.description 
        : '';
    // Создаем объект чата и возвращаем результат
    // (удачно созданный чат или ошибку)
    try {
        const user = await decodeToken(token);
        const { _id } = user;
        const author = _id;
        const chat = { name, description, author };
        const newChat = new Chat(chat);
        await newChat.save();
        answerBuilder(res, newChat, undefined, meta);
    } catch (error) {
        answerBuilder(res, undefined, error, meta, 502);
    }
 }

 /**
 * @function
 * @name updateChat
 * @description Метод обновления информации о чате
 * @param {object} req объект запроса
 * @param {object} res объект ответа
 * @returns {undefined}
 * @exports
 */
 export async function updateChat(req, res) {
    // Собираем стандартный объект мета-данных
    const meta = buildMeta(req);
    // Получаем данные из запроса
    const id = (req.hasOwnProperty('query') && req.query.hasOwnProperty('id')) 
        ? req.query.id
        : undefined;
    const name = (req.hasOwnProperty('body') && req.body.hasOwnProperty('name'))
        ? req.body.name
        : `чат от ${(new Date).toLocaleTimeString()}`;
    const description = () 
        ? req.body.description 
        : '';
    const token = getToken(req);
    // Пытаемся обновить данные чата. 
    // Получаем чат, обновляем данные и созраняем. Возвращаем ответ
    // об удачном сохранении.
    // Либо возвращаем ошибку
    try {
        const user = await decodeToken(token); 
        const filter = { _id: id, author: user._id };
        const chat = await Message.findOne(filter);

        if (chat) {
            chat.name = name;
            chat.description = description;
            await chat.save();
            answerBuilder(res, chat, undefined, meta);
        } else {
            defaultErrors(res, 'NOT_FOUD', meta);
        }
    } catch (error) {
        answerBuilder(res, undefined, error, meta, 502);
    }
 }