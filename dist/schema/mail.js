"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mailSchema = new mongoose_1.Schema({
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
    subject: {
        type: 'string',
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});
const Mail = (0, mongoose_1.model)('Mail', mailSchema);
exports.default = Mail;
//# sourceMappingURL=mail.js.map