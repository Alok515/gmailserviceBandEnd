import { google } from 'googleapis'
import * as parseMessage from 'gmail-api-parse-message'
import MailComposer = require('nodemailer/lib/mail-composer')
import Mail from '../schema/mail';
import Sent from '../schema/sent';
import * as fs from 'fs-extra'
import * as path from 'path'

const User_PATH = path.join(__dirname, '../user.json');

const gmail = google.gmail('v1')


const getMail = async () => {
    // check if the token already exists
    const exists = await fs.exists(User_PATH)
    const token = exists ? await fs.readFile(User_PATH, 'utf8') : ''

    if (token) {
        const user = await JSON.parse(token);
        return user.email;
    }
}

const saveUser = async (user) => {
    await fs.writeFile(User_PATH, JSON.stringify(user))
}

/**
 * Get messages from gmail api
 * @return {array} the array of messages
 */
export const getMessages = async (params) => {
    const response = await gmail.users.messages.list({ userId: 'me', ...params })
    const messages = await Promise.all(response.data.messages.map(async message => {
        const messageResponse = await getMessage({ messageId: message.id })
        return parseMessage(messageResponse)
    }))
    const userMail = String(getMail());
    messages.map((message) => {
        Mail.findOne({ m_id: message.id })
            .then((mail) => {
                if (mail === undefined || mail === null) {
                    Mail.create({
                        m_id: message.id,
                        snippet: message.snippet,
                        user: userMail,
                        internalDate: message.internalDate
                    });
                }
            });
    });
    const newData = await Promise.all(messages.map(async mail=>{
        const response = await gmail.users.messages.get({ id: mail.id, userId: 'me' });
        const newMessage = await parseMessage(response.data);
        return ({
            id: newMessage.id,
            label: newMessage.labelIds,
            snippet: newMessage.snippet,
            subject: newMessage.headers?.subject,
            from: newMessage.headers?.from,
            date: newMessage.headers?.date,
            textPlain: newMessage.textPlain
        })
    }));
    
    //console.log(newData[0]);

    return newData;
}

/**
 * Get specific message data for a given message id
 * @param  {string} messageId The message id to retrieve for
 * @return {object} the object message
 */
export const getMessage = async ({ messageId }) => {
    const response = await gmail.users.messages.get({ id: messageId, userId: 'me' })
    const message = parseMessage(response.data)
    return message
}


/**
 * Get specific message data for a given message id
 * @param  {string} messageId The message id to retrieve for
 * @return {object} the object message
 */
export const getProfile = async () => {
    const response = await gmail.users.getProfile({ userId: 'me' })
    const user = {
        email: response.data.emailAddress,
    }
    await saveUser(user);
    return response.data.emailAddress;
}
/**
 * Get specific message data for a given message id
 * @param  {string} messageId The message id to retrieve for
 * @return {object} the object message
 */
export const deleteMessage = async ({ messageId }) => {
    const response = await gmail.users.messages.delete({ id: messageId, userId: 'me' })
    const message = parseMessage(response.data)
    const flag = await Mail.findOneAndUpdate({
        m_id: messageId,
    }, {
        isDeleted: true,
    });
    if (flag) console.log("Message deleted from gmail and marked as delete in DB");
    return message
}



/**
 * Given the attachment id, get specific attachment data
 * @param  {string} attachmentId The attachment id to retrieve for
 * @param  {string} messageId The message id where the attachment is
 * @return {object} the object attachment data
 */
export const getAttachment = async ({ attachmentId, messageId }) => {
    const response = await gmail.users.messages.attachments.get({
        id: attachmentId, messageId, userId: 'me'
    })
    const attachment = response.data
    return attachment
}

/**
 * Get all messages thread for a given message id
 * @param  {string} messageId The message id to retrieve its thread
 * @return {array} the array of messages
 */
export const getThread = async ({ messageId }) => {
    const response = await gmail.users.threads.get({ id: messageId, userId: 'me' })
    const messages = await Promise.all(response.data.messages.map(async (message: any) => {
        const messageResponse = await gmail.users.messages.get({ id: message.id, userId: 'me' })
        return parseMessage(messageResponse.data)
    }))
    return messages
}

/**
 * Send a mail message with given arguments
 * @param  {string} to The receiver email
 * @param  {string} subject The subject of the mail
 * @param  {string} text The text content of the message
 * @param  {Array}  attachments An array of attachments
 */
export const sendMessage = async ({ to, subject = '', text = '', attachments = [] }: { to: string, subject?: string, text?: string, attachments?: any[] }) => {

    const userMail = String(getMail());
    // build and encode the mail
    await Sent.create({
        toMail: to,
        sub: subject,
        msg: text,
        user: userMail
    });
    const buildMessage = () => new Promise<string>((resolve, reject) => {
        const message = new MailComposer({
            to,
            subject,
            text,
            attachments,
            textEncoding: 'base64'
        })

        message.compile().build((err, msg) => {
            if (err) {
                reject(err)
            }

            const encodedMessage = Buffer.from(msg)
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '')

            resolve(encodedMessage)
        })
    })

    const encodedMessage = await buildMessage()

    await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedMessage
        }
    })
}