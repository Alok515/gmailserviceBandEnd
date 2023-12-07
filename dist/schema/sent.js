"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const sentSchema = new mongoose_1.Schema({
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
    isdeleted: {
        type: 'boolean',
        default: false
    },
    user: {
        type: 'string'
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});
const Send = (0, mongoose_1.model)('Send', sentSchema);
exports.default = Send;
//# sourceMappingURL=sent.js.map