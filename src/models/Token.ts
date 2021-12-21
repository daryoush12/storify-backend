
import { Schema } from "mongoose";
import mongoose from "mongoose";
import { ObjectID } from "mongodb";
import { UserDocument } from "./User";

export type TokenDocument = mongoose.Document & {  
    code: string;
    type: string;
    user: UserDocument;
};

export const tokenSchema = new mongoose.Schema<TokenDocument>({
    code: String,
    type:String,
    user: ObjectID,
}, {timestamps: true });

//Expire tokens after 3600 seconds babyyy
tokenSchema.set("expireAfterSeconds", 3600);

export const Token = mongoose.model<TokenDocument>("Token", tokenSchema);

