"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MongooseConnect = async () => {
    const connection = await mongoose_1.default.connect("mongodb+srv://alok28:alok108@alok.lpdwxfo.mongodb.net/gmail?&retryWrites=true&w=majority");
    if (connection) {
        console.log('Connected to Mongoose server');
    }
};
exports.default = MongooseConnect;
//# sourceMappingURL=mongooseConfig.js.map