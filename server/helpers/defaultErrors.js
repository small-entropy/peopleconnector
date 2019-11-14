export default function defaultErrors(res, code, meta) {
    let message;
    let status;
    let errors;
    switch (code) {
        case 'ALREADY_REGISTER':
            message = 'Ошибка. Такой пользователь уже зарегистрирован';
            status = 502;
            break;
        case 'NOT_REGISTER_DATA':
            message = 'Введены не все обязательные поля для регистрации';
            status = 502;
            break;
        case 'NOT_AUTH':
            message = 'Вы не атворизованы';
            status = 502;
            break;
        case 'USER_NOT_FOND':
            message = 'Такой пользователь не найден';
            status = 404;
            break;
        case 'CONTRACT_NOT_FOUND':
            message = 'Заказ не найден';
            status = 404;
            break;
        case 'WRONG_PASS':
            message = 'Вы ввели не коректный пароль';
            status = 502;
            break;
        case 'WRONG_TOKEN':
            message = 'Передан не верный токен';
            status = 502;
            break;
        case 'LOL_CHTO':
            message = 'У вас не хватает прав для этой операции';
            status = 502;
            break;
        default:
            message = 'Неизвестная ошибка';
            status = 502;
            break;
    }
    return res.status(status).json({
        data: [],
        errors: [{message}],
        meta
    });
}