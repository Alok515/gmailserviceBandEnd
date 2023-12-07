
import {Schema, model} from 'mongoose';

const sentSchema = new Schema({
    toMail: {
        type: 'string',
        required: true
    },
    sub: {
        type: 'string',
    },
    msg: {
        type: 'string',
    },
    isdeleted:{
        type: 'boolean',
        default: false
    },
    user: {
        type: 'string'
    }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});

const Send = model('Send', sentSchema);

export default Send;