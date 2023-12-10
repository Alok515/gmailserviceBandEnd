import { Schema, model } from 'mongoose';
 
const mailSchema = new Schema({
    m_id: {
        type: 'string',
        required: true,
        unique: true
    },
    snippet: {
        type: 'string',
    },
    isDeleted: {
        type: 'boolean',
        default: false
    },
    user: {
        type: 'string',
    },
    date: {
        type: 'string'
    },
    from: {
        type: 'string'
    },
    subject:{
        type: 'string',
    }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});


const Mail = model('Mail', mailSchema);

export default Mail;