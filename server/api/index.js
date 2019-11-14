// Express object
import express from 'express';

// Callbacks for system routers
import {
   checkHealth
} from '../routes/callbacks/system';

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

// Get express router object
const router = express.Router();

// Router for check server health
router.get('/health', checkHealth);

router.get('/tags', getTagsList);
router.post('/tags', createTag);
router.put('/tags', upadateTag);
router.delete('/tags', removeTag);

router.get('/messages', getMessageList);
router.post('/messages', createMessage);
router.put('/messages/:id', upadateMessage);

router.get('/chats', getChatsList);
router.post('/chats', createChat);
router.put('/chats/:id', updateChat);

router.get('/users', getUserList);
router.put('/users/:id', upadteUser);

router.post('/login', login);
router.all('/logout', logout);

// Export the server middleware
module.exports = router;
