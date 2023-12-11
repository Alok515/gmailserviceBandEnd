"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserToken = exports.Token = void 0;
const mongoose_1 = require("mongoose");
const TokenSchema = new mongoose_1.Schema({
    token: {
        type: "object",
    },
    check: {
        type: "number",
        default: 1
    },
    user: {
        type: "string",
    }
}, {
    timestamps: true,
});
exports.Token = (0, mongoose_1.model)("Token", TokenSchema);
const UsertokenSchema = new mongoose_1.Schema({
    refreshToken: {
        type: "string",
    },
    email: {
        type: "string",
    }
});
exports.UserToken = (0, mongoose_1.model)("UserToken", UsertokenSchema);
//# sourceMappingURL=token.js.map