import mongoose from 'mongoose'
const Types = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const schema = new Schema({
    username: Types.String,
    profile: {},
    tags: {},
    scores: {}
});

export default mongoose.model('User', schema);
