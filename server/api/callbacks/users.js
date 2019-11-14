import buildMeta from '../../helpers/buildMeta';
import answerBuilder from '../../helpers/answerBuilder';
import User from '../../models/User';
import defaultErrors from '../../helpers/defaultErrors';
import decodeToken from '../../helpers/decodeToken';
import getToken from '../../helpers/getToken';

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

 export async function upadteUser(req, res) {
    const meta = buildMeta(req);
    const id = req.query.id
    const { profile, scores, tags } = req.body;
    const token = getToken(req);

    try {
        const user = await decodeToken(token); 
        const filter = { _id: id, author: user._id };
        const findedUser = await User.findOne(filter);

        if (findedUser) {
            user.profile = profile;
            user.scores = scores;
            user.tags = tags;
            await user.save();
            answerBuilder(res, user, undefined, meta);
        } else {
            defaultErrors(res, 'NOT_FOUD', meta);
        }
    } catch (error) {
        answerBuilder(res, undefined, error, meta, 502);
    }
 }