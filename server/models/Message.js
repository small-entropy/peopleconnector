import mongoose from 'mongoose'
const Types = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const schema = new Schema({
    author: Types.String,
    text: Types.String,
    chatId: Types.String,
    date: {
        type: Types.Date,
        default: Date.now 
    }
});

export default mongoose.model('Message', schema);
