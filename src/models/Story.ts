
import { Schema } from "mongoose";
import mongoose from "mongoose";

interface Chapter {
    title: string;
    content: string;
}

export type StoryDocument = mongoose.Document & {  
    title: string;
    chapters: Chapter[];
};

export const storySchema = new mongoose.Schema<StoryDocument>({
    title: String,
    chapters: Array,
}, {timestamps: true});

export const Story = mongoose.model<StoryDocument>("Story", storySchema);
