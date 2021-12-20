import { Story, StoryDocument } from "../models/Story";
import { Router } from "express";
import { Request, Response } from "express";

const router = Router();

export function createStory (req: Request, res: Response): void {
    const storyParam: StoryDocument = req.body;
    const newStory = new Story(storyParam);
    newStory.save();

    res.status(200).send("Creation was successful");
}

router.post("/create", createStory);

export default router;

