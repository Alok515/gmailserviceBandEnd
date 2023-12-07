"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MongooseConnect = async () => {
    const connection = await mongoose_1.default.connect("");
    if (connection) {
        console.log('Connected to Mongoose server');
    }
};
exports.default = MongooseConnect;
//# sourceMappingURL=mongooseConfig.js.map
