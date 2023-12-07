"use strict";
const express = require("express");
const gmail = require("../functions/gmail-api");
const auth = require("../functions/gmail-auth");
const router = express.Router();
/**
 * Route for getting gmail messages
 */
router.get('/getMessages', async (req, res) => {
    try {
        const params = req.query;
        const messages = await gmail.getMessages(params);
        return res.send({ messages });
    }
    catch (e) {
        console.error(e);
        return res.send({ error: e });
    }
});
router.get('/', async (req, res) => {
    try {
        const messages = await gmail.getProfile();
        return res.send({ messages });
    }
    catch (e) {
        console.error(e);
        return res.send({ error: e });
    }
});
/**
 * Route for getting a specific gmail message
 */
router.get('/getMessage', async (req, res) => {
    try {
        const messageId = req.query.messageId;
        const message = await gmail.getMessage({ messageId });
        return res.send({ message });
    }
    catch (e) {
        return res.send({ error: e });
    }
});
router.delete('/deleteMessage', async (req, res) => {
    try {
        const messageId = req.query.messageId;
        const message = await gmail.deleteMessage({ messageId });
        return res.send({ message });
    }
    catch (e) {
        return res.send({ error: e });
    }
});
/**
 * Route for getting a specific attachemnt from a message
 */
router.get('/getAttachment', async (req, res) => {
    try {
        const attachmentId = req.query.attachmentId;
        const messageId = req.query.messageId;
        const attachment = await gmail.getAttachment({ attachmentId, messageId });
        return res.send({ attachment });
    }
    catch (e) {
        return res.send({ error: e });
    }
});
/**
 * Route for getting gmail messages from a thread
 */
router.get('/getThread', async (req, res) => {
    try {
        const messageId = req.query.messageId;
        const messages = await gmail.getThread({ messageId });
        return res.send({ messages });
    }
    catch (e) {
        return res.send({ error: e });
    }
});
/**
 * Route for send a mail message
 */
router.post('/sendMessage', async (req, res) => {
    try {
        const { to, subject, text } = req.body;
        if (!to) {
            throw 'Recipient email(s) is required';
        }
        await gmail.sendMessage({ to, subject, text });
        return res.send({ message: 'Message sent!' });
    }
    catch (e) {
        return res.send({ error: e });
    }
});
router.get('/logout', async (req, res) => {
    try {
        auth.logout();
        return res.send("You have been logged out");
    }
    catch (e) {
        return res.send({ error: e });
    }
});
module.exports = router;
//# sourceMappingURL=api-routes.js.map