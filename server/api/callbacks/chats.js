import buildMeta from '../../helpers/buildMeta';
import answerBuilder from '../../helpers/answerBuilder';
import Chat from '../../models/Chat';
import defaultErrors from '../../helpers/defaultErrors';
import decodeToken from '../../helpers/decodeToken';
import getToken from '../../helpers/getToken';

export async function getChatsList(req, res) {
    const meta = buildMeta(req);

    const limit = (req.query.limit) ? Number(req.query.limit) : 15;
    const skip = (req.query.skip) ? Number(req.query.skip) : 0;
    const filter = (req.query.filter) ? JSON.parse(req.query.filter) : {};
    const sort = (req.query.sort) ? JSON.parse(req.query.sort) : {};

    try {
        const chats = await Chat.find(filter).sort(sort).limit(limit).skip(skip).exec();
        const count = await Chat.count(filter).exec();
        
        meta.total = count; 
        
        answerBuilder(res, chats, undefined, meta);
    } catch (error) {
        answerBuilder(res, undefined, error, meta, 502);
    }
 }

 export async function createChat(req, res) {
    const meta = buildMeta(req);
    const token = getToken(req);
    const { name, description } = req.body;

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

 export async function updateChat(req, res) {
    const meta = buildMeta(req);
    const id = req.query.id
    const { name, description } = req.body;
    const token = getToken(req);

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