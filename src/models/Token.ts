
import { Schema } from "mongoose";
import mongoose from "mongoose";
import { ObjectID } from "mongodb";

export type TokenDocument = mongoose.Document & {  
    token: string;
    type: string;
    user: string;
};

export const tokenSchema = new mongoose.Schema<TokenDocument>({
    title: String,
    chapters: Array,
    user: ObjectID,
}, {timestamps: true });

export const Story = mongoose.model<TokenDocument>("Story", tokenSchema)
.createIndexes({expireAfterSeconds: 3600});
