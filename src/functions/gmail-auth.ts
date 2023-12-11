import { google } from 'googleapis'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as credentials from '../credentials.json'
import * as useToken from '../schema/token';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly','https://www.googleapis.com/auth/gmail.modify','https://www.googleapis.com/auth/gmail.compose','https://www.googleapis.com/auth/gmail.send','https://mail.google.com'];
const TOKEN_PATH = path.join(__dirname, '../token.json');
const User_PATH = path.join(__dirname, '../user.json');

export const authorize = async () => {
    // check if the token already exists
    const exists = await useToken.Token.findOne({
        check: 1
    });
    const token = exists ? exists.token : ''

    if(token){
        authenticate(token);
        return true
    }
    
    return false
}

export const logout = async () => {
    await useToken.Token.findOneAndDelete({
        check: 1
    });
}

export const getNewToken = async () => {
    const oAuth2Client = getOAuth2Client()

    return oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: SCOPES,
    })
}

export const saveToken = async (token) => {
    await fs.writeFile(TOKEN_PATH, JSON.stringify(token))
}

export const getOAuth2Client = () => {
    const GOOGLE_CLIENT_ID = credentials.web.client_id
    const GOOGLE_CLIENT_SECRET = credentials.web.client_secret
    const GOOGLE_CALLBACK_URL = credentials.web.redirect_uris[0]

    const oAuth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL)
    return oAuth2Client
}

const authenticate = (token) => {
    const oAuth2Client = getOAuth2Client()

    oAuth2Client.setCredentials(token)
    google.options({
        auth: oAuth2Client
    })
}