import { Schema, model } from "mongoose";

const TokenSchema = new Schema({
    token: {
        type: "object",
    },
    check: {
        type: "number",
        default: 1
    },
    user:{
        type: "string",
    }
},{
    timestamps: true,
});

export const Token = model("Token", TokenSchema);

const UsertokenSchema = new Schema({
    refreshToken: {
        type: "string",
    },
    email:{
        type: "string",
    }
})

export const UserToken = model("UserToken", UsertokenSchema);
