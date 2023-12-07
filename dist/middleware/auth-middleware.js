"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const auth = require("../functions/gmail-auth");
const authMiddleware = async (req, res, next) => {
    try {
        const authenticated = await auth.authorize();
        if (!authenticated) {
            throw 'No Authenticated';
        }
        next();
    }
    catch (e) {
        res.status(401);
        res.send({ error: e });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth-middleware.js.map