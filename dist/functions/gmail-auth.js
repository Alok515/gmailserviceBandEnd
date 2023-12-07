"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOAuth2Client = exports.saveToken = exports.getNewToken = exports.logout = exports.authorize = void 0;
const googleapis_1 = require("googleapis");
const fs = require("fs-extra");
const path = require("path");
const credentials = require("../credentials.json");
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/gmail.compose', 'https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = path.join(__dirname, '../token.json');
const User_PATH = path.join(__dirname, '../user.json');
const authorize = async () => {
    // check if the token already exists
    const exists = await fs.exists(TOKEN_PATH);
    const token = exists ? await fs.readFile(TOKEN_PATH, 'utf8') : '';
    if (token) {
        authenticate(JSON.parse(token));
        return true;
    }
    return false;
};
exports.authorize = authorize;
const logout = async () => {
    fs.unlink(TOKEN_PATH);
    fs.unlink(User_PATH);
};
exports.logout = logout;
const getNewToken = async () => {
    const oAuth2Client = (0, exports.getOAuth2Client)();
    return oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: SCOPES,
    });
};
exports.getNewToken = getNewToken;
const saveToken = async (token) => {
    await fs.writeFile(TOKEN_PATH, JSON.stringify(token));
};
exports.saveToken = saveToken;
const getOAuth2Client = () => {
    const GOOGLE_CLIENT_ID = credentials.web.client_id;
    const GOOGLE_CLIENT_SECRET = credentials.web.client_secret;
    const GOOGLE_CALLBACK_URL = credentials.web.redirect_uris[0];
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL);
    return oAuth2Client;
};
exports.getOAuth2Client = getOAuth2Client;
const authenticate = (token) => {
    const oAuth2Client = (0, exports.getOAuth2Client)();
    oAuth2Client.setCredentials(token);
    googleapis_1.google.options({
        auth: oAuth2Client
    });
};
//# sourceMappingURL=gmail-auth.js.map