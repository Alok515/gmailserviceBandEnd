"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Cors = require("cors");
const authRoutes = require("./routes/auth-routes");
const apiRoutes = require("./routes/api-routes");
const auth_middleware_1 = require("./middleware/auth-middleware");
const mongooseConfig_1 = require("./config/mongooseConfig");
const Cloud = require("@google-cloud/functions-framework");
(0, mongooseConfig_1.default)();
const app = express();
app.use(Cors({ origin: true }));
// for parsing application/json
app.use(express.json());
// for parsing application/xwww-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// gmail auth routes
app.use('/', authRoutes);
// auth middleware for api routes
app.use(auth_middleware_1.authMiddleware);
// gmail api routes
app.use('/api', apiRoutes);
// start the server
/*const PORT = 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});*/
Cloud.http('GmailApi', app);
//# sourceMappingURL=index.js.map