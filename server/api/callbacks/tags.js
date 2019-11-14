import buildMeta from '../../helpers/buildMeta';
import answerBuilder from '../../helpers/answerBuilder';
import Tag from '../../models/Tag';
import defaultErrors from '../../helpers/defaultErrors';

export async function getTagsList(req, res) {
    const meta = buildMeta(req);

    const limit = (req.query.limit) ? Number(req.query.limit) : 15;
    const skip = (req.query.skip) ? Number(req.query.skip) : 0;
    const filter = (req.query.filter) ? JSON.parse(req.query.filter) : {};
    const sort = (req.query.sort) ? JSON.parse(req.query.sort) : {};

    try {
        const tags = await Tag.find(filter).sort(sort).limit(limit).skip(skip).exec();
        const count = await Tag.count(filter).exec();
        
        meta.total = count; 
        
        answerBuilder(res, tags, undefined, meta);
    } catch (error) {
        answerBuilder(res, undefined, error, meta, 502);
    }
 }

 export async function createTag(req, res) {
    const meta = buildMeta(req);
    const { text } = req.body;
    const removed = false;
    const filter = { removed: false };
    try {
        const tag = await Tag.findOne(filter);
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

 export async function upadateTag(req, res) {
    const meta = buildMeta(req);
    const { id, text } = req.body;
    const removed = false;

    try {
        const filter = { _id: id, removed };
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

 export async function removeTag(req, res) {
    const meta = buildMeta(req);
    const { id } = req.body;
    const removed = false;
    try {
        const filter = { _id: id, removed };
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