import answerBuilder from '../../helpers/answerBuilder';
import buildMeta from '../../helpers/buildMeta';
import User from '../../models/User';
import defaultErrors from '../../helpers/defaultErrors';
import createToken from '../../helpers/createToken';

/**
 * @function
 * @name logout
 * @description Функция, реализуюзая логаут пользователя
 * @param {object} req объект запроса
 * @param {object} res объект ответа
 * @returns {undefined}
 * @exports 
 */
export function logout(req, res) {
    const meta = buildMeta(req);
    meta.message = 'Выход успешно выполнен';
    answerBuilder(res, undefined, undefined, meta);
}

/**
 * @function
 * @name login
 * @description Функция, реализующая авторизация или регистрацию пользователя
 * @param {object} req объект запроса
 * @param {object} res объект ответа
 * @returns {undefined}
 * @exports 
 */
export async function login(req, res) {
    // Получаем тело запроса
    const body = req.body;
    // Получаем действие, которое требуется
    const action = (body.hasOwnProperty('action')) ? body.action : undefined;
    // Получаем объект мета-данных
    const meta = buildMeta(req);
    // Проверяем наличие авторизационного токена СБИС
    const sbisToken = (body.hasOwnProperty('sbisToken')) 
                ? req.body 
                : undefined;
    // Записываем авторизационный токен СБИС
    // TODO: сделать проверку токена на валидность
    // для целей привязки к API пока не стал делать 
    meta.sbisToken = sbisToken;
    // Проверяем наличие токена
    if (sbisToken) {
        // Выполняем действие в зависимости от действия
        switch (action) {
            case 'auth':
                // Для авторизации получаем пользователя из БД
                try {
                    // Получаем пользователя из БД
                    const user = await User.findOne({ username });
                    // Проверяем найден ли пользователь. Если найден - то создаём
                    // JWT и возвращаем с ответ с данными пользователя
                    // Если пользователь не найдем - возвращаем ошибку
                    if (user) {
                        meta.token = await createToken(user);
                        answerBuilder(res, user, undefined, meta);
                    } else {
                        defaultErrors(res, 'USER_NOT_FOND', meta);
                    }
                } catch (error) {
                    // Обрабатываем ошибку выполнения
                    answerBuilder(res, undefined, error, meta, 502);
                }
                break;
            case 'register':
                // Для регисрации проверяем переданы ли данные для регистрации
                // пользователя (username)
                // Если данные переданы - то регистрируем пользователя, создаем 
                // JWT и возвращаем ответ.
                // Если данные не переданы - обрабатываем ошибку
                try {
                    const username = (body.hasOwnProperty('username'))
                        ? body.username
                        : undefined;
                    if (username) {
                        const profile = (body.hasOwnProperty('profile'))
                            ? body.profile
                            : {};
                        const tags = (body.hasOwnProperty('tags'))
                            ? body.tags
                            : {};
                        const scores = {};
                        const data = { username, profile, tags, scores };
                        const user = new User(data);
                        await user.save();
                        meta.token = await createToken(user);
                        answerBuilder(res, user, undefined, meta);
                    } else {
                        defaultErrors(res, 'NOT_REGISTER_DATA', meta);
                    }
                } catch (error) {
                    answerBuilder(res, undefined, error, meta, 502);
                }
                break;
            default:
                // Обрабатываем, что фронт дал действие, которое не существует.
                defaultErrors(res, undefined, meta);
                break;
        }
    } else {
        // Если не был передан токен СБИС - просто выкидываем ошибку
        defaultErrors(res, 'NOT_AUTH', meta);
    }
}