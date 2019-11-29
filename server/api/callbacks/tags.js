import buildMeta from '../../helpers/buildMeta';
import answerBuilder from '../../helpers/answerBuilder';
import Tag from '../../models/Tag';
import defaultErrors from '../../helpers/defaultErrors';

/**
 * @function
 * @name getTagsList
 * @description Функция, которая возвращает пагинированный список тегов
 * @param {object} req объект запроса 
 * @param {object} res объект ответа
 * @returns {undefined}
 * @exports 
 */
export async function getTagsList(req, res) {
    // Собираем стандартный объект мета-данных
    const meta = buildMeta(req);
    // Получаем данные для пагинации
    const limit = (req.query.limit) ? Number(req.query.limit) : 15;
    const skip = (req.query.skip) ? Number(req.query.skip) : 0;
    const filter = (req.query.filter) ? JSON.parse(req.query.filter) : {};
    const sort = (req.query.sort) ? JSON.parse(req.query.sort) : {};
    // Пытаемся получить список тегов и их общее количество
    try {
        // Получаем список тегов
        const tags = await Tag.find(filter).sort(sort).limit(limit).skip(skip).exec();
        // Получаем общее количество тегов
        const count = await Tag.count(filter).exec();
        // Добавляем общее количество в мета-данные
        meta.total = count; 
        // Возвращаем ответ
        answerBuilder(res, tags, undefined, meta);
    } catch (error) {
        // Возвращаем ответ с ошибкой
        answerBuilder(res, undefined, error, meta, 502);
    }
 }

 /**
 * @function
 * @name createTag
 * @description Функция, которая создаёт тег в БД
 * @param {object} req объект запроса 
 * @param {object} res объект ответа
 * @returns {undefined}
 * @exports 
 */
 export async function createTag(req, res) {
    // Собираем стандартный объект мета-данных
    const meta = buildMeta(req);
    // Получаем данные из тела запроса
    const text = (req.hasOwnProperty('body') && req.body.hasOwnProperty('text'))
        ? req.body.text 
        : `тег_${(new Date).toLocaleTimeString()}`;
    const removed = false;
    // Собираем объект фильтров
    const filter = { removed: false };
    // Получаем тег из БД или возвращаем ошибку
    try {
        // Получаем тег из БД по фильтрам
        const tag = await Tag.findOne(filter);
        // Проверяем, найден ли тег с заданными фильтрам. Если тег найден
        // возвращаем его.
        // Если тег не найден - создаем его и возвращаем.
        if (tag) {
            answerBuilder(res, tag, undefined, meta);
        } else {
            const newTag = { text, removed };
            const createdTag = new Tag(newTag);
            await createdTag.save();
            answerBuilder(res, createdTag, undefined, meta);
        }
    } catch (error) {
        answerBuilder(res, undefined, error, meta, 502);
    }
 }

 /**
 * @function
 * @name upadateTag
 * @description Функция, которая обновляет тег
 * @param {object} req объект запроса 
 * @param {object} res объект ответа
 * @returns {undefined}
 * @exports 
 */
 export async function upadateTag(req, res) {
    // Собираем стандартный объект мета-данных
    const meta = buildMeta(req);
    // Получаем данные из тела запроса
    const id = (req.hasOwnProperty('body') && req.body.hasOwnProperty('id')) 
        ? req.body.id 
        : undefined;
    const text = (req.hasOwnProperty('body') && req.body.hasOwnProperty('text')) 
        ? req.body.id 
        : undefined; 
    const removed = false;

    // Пытаемся найти тег. Если тег находим - обновляем.
    // Обратываем ошибки
    try {
        // Собираем фильтр для поиска
        const filter = { _id: id, removed };
        // Получаем тег из БД
        // Если тег найден - обновляем данные, сохраняем в БД и возвращаем результат.
        // Если тег не найден - возвращаем ошибку
        const tag = await Tag.findOne(filter);
        if (tag) {
            tag.text = text;
            await tag.save();
            answerBuilder(res, tag, undefined, meta);
        } else {
            defaultErrors(res, 'NOT_FOUD', meta);
        }
    } catch (error) {
        answerBuilder(res, undefined, error, meta, 502);
    }
 }

 /**
 * @function
 * @name removeTag
 * @description Функция удаления тега (помечает тег как удалённый)
 * @param {object} req объект запроса 
 * @param {object} res объект ответа
 * @returns {undefined}
 * @exports 
 */
 export async function removeTag(req, res) {
    // Собираем стандартный объект мета-данных
    const meta = buildMeta(req);
    // Получаем индефикатор из тела запроса
    const id = (req.hasOwnProperty('body') && req.body.hasOwnProperty('id')) 
        ? req.body.id 
        : undefined;
    const removed = false;
    // Ищем тег и обновляем значение.
    // Обрабатываем ошибкуи
    try {
        // Собираем фильтр
        const filter = { _id: id, removed };
        // Пытаемся найти в БД тег. 
        // Если тег найходим - обновляем данные, сохраняем в БД и возвращаем результат.
        // Если тег не был найден - возвращаем стандатную ошибку
        const tag = await Tag.findOne(filter);
        if (tag) {
            tag.removed = true;
            await tag.save();
            answerBuilder(res, tag, undefined, meta);
        } else {
            defaultError(sres, 'NOT_FOUD', meta);
        }
    } catch (error) {
        answerBuilder(res, undefined, error, meta, 502);
    }
 }