"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getThread = exports.getAttachment = exports.deleteMessage = exports.getProfile = exports.getMessage = exports.getMessages = void 0;
const googleapis_1 = require("googleapis");
const parseMessage = require("gmail-api-parse-message");
const MailComposer = require("nodemailer/lib/mail-composer");
const mail_1 = require("../schema/mail");
const sent_1 = require("../schema/sent");
const fs = require("fs-extra");
const path = require("path");
const User_PATH = path.join(__dirname, '../user.json');
const gmail = googleapis_1.google.gmail('v1');
const getMail = async () => {
    // check if the token already exists
    const exists = await fs.exists(User_PATH);
    const token = exists ? await fs.readFile(User_PATH, 'utf8') : '';
    if (token) {
        const user = await JSON.parse(token);
        return user.email;
    }
};
const saveUser = async (user) => {
    await fs.writeFile(User_PATH, JSON.stringify(user));
};
/**
 * Get messages from gmail api
 * @return {array} the array of messages
 */
const getMessages = async (params) => {
    const response = await gmail.users.messages.list(Object.assign({ userId: 'me' }, params));
    const messages = await Promise.all(response.data.messages.map(async (message) => {
        const messageResponse = await (0, exports.getMessage)({ messageId: message.id });
        return parseMessage(messageResponse);
    }));
    const userMail = await getMail();
    const newData = await Promise.all(messages.map(async (mail) => {
        var _a, _b, _c;
        const response = await gmail.users.messages.get({ id: mail.id, userId: 'me' });
        const newMessage = await parseMessage(response.data);
        return ({
            id: newMessage.id,
            label: newMessage.labelIds,
            snippet: newMessage.snippet,
            subject: (_a = newMessage.headers) === null || _a === void 0 ? void 0 : _a.subject,
            from: (_b = newMessage.headers) === null || _b === void 0 ? void 0 : _b.from,
            date: (_c = newMessage.headers) === null || _c === void 0 ? void 0 : _c.date,
            textPlain: newMessage.textPlain
        });
    }));
    await Promise.all(newData.map((message) => {
        mail_1.default.findOne({ m_id: message.id })
            .then((mail) => {
            if (mail === undefined || mail === null) {
                mail_1.default.create({
                    m_id: message.id,
                    snippet: message.snippet,
                    user: userMail,
                    date: message.date,
                    from: message.from,
                    subject: message.subject,
                });
            }
        });
    }));
    //console.log(newData[0]);
    return newData;
};
exports.getMessages = getMessages;
/**
 * Get specific message data for a given message id
 * @param  {string} messageId The message id to retrieve for
 * @return {object} the object message
 */
const getMessage = async ({ messageId }) => {
    const response = await gmail.users.messages.get({ id: messageId, userId: 'me' });
    const message = parseMessage(response.data);
    return message;
};
exports.getMessage = getMessage;
/**
 * Get specific message data for a given message id
 * @param  {string} messageId The message id to retrieve for
 * @return {object} the object message
 */
const getProfile = async () => {
    const response = await gmail.users.getProfile({ userId: 'me' });
    const user = {
        email: response.data.emailAddress,
    };
    await saveUser(user);
    return response.data.emailAddress;
};
exports.getProfile = getProfile;
/**
 * Get specific message data for a given message id
 * @param  {string} messageId The message id to retrieve for
 * @return {object} the object message
 */
const deleteMessage = async ({ messageId }) => {
    const response = await gmail.users.messages.delete({ id: messageId, userId: 'me' });
    const message = parseMessage(response.data);
    const flag = await mail_1.default.findOneAndUpdate({
        m_id: messageId,
    }, {
        isDeleted: true,
    });
    if (flag)
        console.log("Message deleted from gmail and marked as delete in DB");
    return message;
};
exports.deleteMessage = deleteMessage;
/**
 * Given the attachment id, get specific attachment data
 * @param  {string} attachmentId The attachment id to retrieve for
 * @param  {string} messageId The message id where the attachment is
 * @return {object} the object attachment data
 */
const getAttachment = async ({ attachmentId, messageId }) => {
    const response = await gmail.users.messages.attachments.get({
        id: attachmentId, messageId, userId: 'me'
    });
    const attachment = response.data;
    return attachment;
};
exports.getAttachment = getAttachment;
/**
 * Get all messages thread for a given message id
 * @param  {string} messageId The message id to retrieve its thread
 * @return {array} the array of messages
 */
const getThread = async ({ messageId }) => {
    const response = await gmail.users.threads.get({ id: messageId, userId: 'me' });
    const messages = await Promise.all(response.data.messages.map(async (message) => {
        const messageResponse = await gmail.users.messages.get({ id: message.id, userId: 'me' });
        return parseMessage(messageResponse.data);
    }));
    return messages;
};
exports.getThread = getThread;
/**
 * Send a mail message with given arguments
 * @param  {string} to The receiver email
 * @param  {string} subject The subject of the mail
 * @param  {string} text The text content of the message
 * @param  {Array}  attachments An array of attachments
 */
const sendMessage = async ({ to, subject = '', text = '', attachments = [] }) => {
    const userMail = await getMail();
    // build and encode the mail
    await sent_1.default.create({
        toMail: to,
        sub: subject,
        msg: text,
        user: userMail
    });
    const buildMessage = () => new Promise((resolve, reject) => {
        const message = new MailComposer({
            to,
            subject,
            text,
            attachments,
            textEncoding: 'base64'
        });
        message.compile().build((err, msg) => {
            if (err) {
                reject(err);
            }
            const encodedMessage = Buffer.from(msg)
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
            resolve(encodedMessage);
        });
    });
    const encodedMessage = await buildMessage();
    await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedMessage
        }
    });
};
exports.sendMessage = sendMessage;
//# sourceMappingURL=gmail-api.js.map