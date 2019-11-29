// Получаем экземпляр объекта ExpressJS
import express from 'express';

// Импортируем колбеки, вызываемые роутингом
import {
   checkHealth
} from './callbacks/system';

import {
    getTagsList,
    createTag,
    upadateTag,
    removeTag
} from '../api/callbacks/tags';

import {
    getMessageList,
    createMessage,
    upadateMessage
} from '../api/callbacks/messages';

import {
    getChatsList,
    createChat,
    updateChat
} from '../api/callbacks/chats';

import {
    logout,
    login
} from '../api/callbacks/auth';

import {
    getUserList,
    upadteUser
} from '../api/callbacks/users'

// Получаем объект роутинга из экземпляра ExpressJS
const router = express.Router();

// Роут для проверки состояния сервера
router.get('/health', checkHealth);
// Роуты для работы с тегами
router.get('/tags', getTagsList);
router.post('/tags', createTag);
router.put('/tags', upadateTag);
router.delete('/tags', removeTag);
// Роуты для работы с сообщениями
router.get('/messages', getMessageList);
router.post('/messages', createMessage);
router.put('/messages/:id', upadateMessage);
// Роуты для работы с чатами
router.get('/chats', getChatsList);
router.post('/chats', createChat);
router.put('/chats/:id', updateChat);
// Роуты для работы с пользователями
router.get('/users', getUserList);
router.put('/users/:id', upadteUser);
// Роуты для работы с авторизацией
router.post('/login', login);
router.all('/logout', logout);

// Экспортируем экземпляр роутинга
module.exports = router;
