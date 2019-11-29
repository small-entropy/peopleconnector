import buildMeta from '../../helpers/buildMeta';
import answerBuilder from '../../helpers/answerBuilder';
import User from '../../models/User';
import defaultErrors from '../../helpers/defaultErrors';
import decodeToken from '../../helpers/decodeToken';
import getToken from '../../helpers/getToken';

/**
 * @function
 * @name getUserList
 * @description
 * @param {object} req 
 * @param {object} res
 * @returns
 * @exports 
 */
export async function getUserList(req, res) {
    const meta = buildMeta(req);

    const limit = (req.query.limit) ? Number(req.query.limit) : 15;
    const skip = (req.query.skip) ? Number(req.query.skip) : 0;
    const filter = (req.query.filter) ? JSON.parse(req.query.filter) : {};
    const sort = (req.query.sort) ? JSON.parse(req.query.sort) : {};

    try {
        const users = await User.find(filter).sort(sort).limit(limit).skip(skip).exec();
        const count = await User.count(filter).exec();
        
        meta.total = count; 
        
        answerBuilder(res, users, undefined, meta);
    } catch (error) {
        answerBuilder(res, undefined, error, meta, 502);
    }
 }

 /**
 * @function
 * @name upadteUser
 * @description Функция обновляет данные о пользователе
 * @param {object} req объект запроса 
 * @param {object} res объект ответа
 * @returns
 * @exports 
 */
 export async function upadteUser(req, res) {
    // Собираем стандартный объект мета-данных
    const meta = buildMeta(req);
    // Получаем индефикатор пользователя из адресной строки
    const id = (req.hasOwnProperty('query') && req.body.hasOwnProperty('id')) 
        ? req.query.id
        : undefined;
    // Получаем данные из тела запроса
    const profile = (req.hasOwnProperty('body') && req.body.hasOwnProperty('profile'))
        ? req.body.profile
        : undefined;
    const tags = (req.hasOwnProperty('body') && req.body.hasOwnProperty('tags'))
        ? req.body.tags
        : undefined;
    const scores = (req.hasOwnProperty('body') && req.body.hasOwnProperty('scores'))
        ? req.body.scores
        : undefined;
    // Получаем токен из запроса
    const token = getToken(req);

    try {
        // Декодируем токен
        const user = await decodeToken(token); 
        // Собираем фильтр для поиска
        const filter = { _id: id, author: user._id };
        // Ищем пользтвателя
        const findedUser = await User.findOne(filter);
        // Если пользователь найден - обновляем его данные и возвращаем ответ.
        // Если пользователь не найден - возвращаем стандартную ошибку
        if (findedUser) {
            if (profile) {
                user.profile = profile;
            }
            if (scores) {
                user.scores = scores;
            }
            if (tags) {
                user.tags = tags;
            }
            if (scores || tags || profile) {
                await user.save();
            }
            answerBuilder(res, user, undefined, meta);
        } else {
            defaultErrors(res, 'NOT_FOUD', meta);
        }
    } catch (error) {
        answerBuilder(res, undefined, error, meta, 502);
    }
 }