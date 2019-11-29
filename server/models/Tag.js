import mongoose from 'mongoose'
const Types = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const schema = new Schema({
    text: Types.String,
    removed: {
        type: Types.Boolean,
        default: false
    }
});

export default mongoose.model('Tag', schema);
