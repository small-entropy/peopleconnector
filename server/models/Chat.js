import mongoose from 'mongoose'
const Types = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const schema = new Schema({
    author: Types.String,
    name: Types.String,
    description: Types.String
});

export default mongoose.model('Chat', schema);
