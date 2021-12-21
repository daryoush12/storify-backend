import { Story, StoryDocument } from "../models/Story";
import { Router } from "express";
import { Request, Response } from "express";
import passport from "passport";
import * as passportConfig from "../config/passport";

const router = Router();

export function createStory (req: Request, res: Response): void {
    const storyParam: StoryDocument = req.body;
    const newStory = new Story(storyParam);
    newStory.save();

    res.status(200).send("Creation was successful");
}

export function health (req: Request, res: Response): void {

    res.status(200).send("Wonderful health");
}



router.post("/create", createStory);
router.get("/health", health);

export default router;

