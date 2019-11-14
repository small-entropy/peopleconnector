import buildMeta from '../../helpers/buildMeta';
import answerBuilder from '../../helpers/answerBuilder';
import Message from '../../models/Message';
import defaultErrors from '../../helpers/defaultErrors';
import decodeToken from '../../helpers/decodeToken';
import getToken from '../../helpers/getToken';

export async function getMessageList(req, res) {
    const meta = buildMeta(req);

    const limit = (req.query.limit) ? Number(req.query.limit) : 15;
    const skip = (req.query.skip) ? Number(req.query.skip) : 0;
    const filter = (req.query.filter) ? JSON.parse(req.query.filter) : {};
    const sort = (req.query.sort) ? JSON.parse(req.query.sort) : {};

    try {
        const messages = await Message.find(filter).sort(sort).limit(limit).skip(skip).exec();
        const count = await Message.count(filter).exec();
        
        meta.total = count; 
        
        answerBuilder(res, messages, undefined, meta);
    } catch (error) {
        answerBuilder(res, undefined, error, meta, 502);
    }
 }

 export async function createMessage(req, res) {
    const meta = buildMeta(req);
    const token = getToken(req);
    const { text, chatId } = req.body;

    try {
        const user = await decodeToken(token);
        const { _id } = user;
        const author = _id;
        const message = { chatId, text, author };
        const newMesasge = new Message(message);
        await newMesasge.save();
        answerBuilder(res, newMesasge, undefined, meta);
    } catch (error) {
        answerBuilder(res, undefined, error, meta, 502);
    }
 }

 export async function upadateMessage(req, res) {
    const meta = buildMeta(req);
    const id = req.query.id
    const { text } = req.body;
    const token = getToken(req);

    try {
        const user = await decodeToken(token); 
        const filter = { _id: id, author: user._id };
        const message = await Message.findOne(filter);

        if (message) {
            message.text = text;
            await message.save();
            answerBuilder(res, message, undefined, meta);
        } else {
            defaultErrors(res, 'NOT_FOUD', meta);
        }
    } catch (error) {
        answerBuilder(res, undefined, error, meta, 502);
    }
 }