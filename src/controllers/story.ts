import { Story, StoryDocument } from "../models/Story";
import { Router } from "express";
import { Request, Response } from "express";
import {MODIFY_FAIL, CREATION_SUCCESS, ID_FAIL} from "../constants/storymessages";


const router = Router();

/**
 * 
 * Create new story
 * TODO: We should probably make sure each user can make changes into their own resources only.
 * 
 * @param req 
 * @param res 
 */
export const createStory = async(req: Request, res: Response, ): Promise<void> => {
    const storyParam: StoryDocument = req.body;
    if(!storyParam) res.send("Bad param");

    const newStory = new Story(storyParam);
    await newStory.save();
    res.send(CREATION_SUCCESS);
};

export function health (req: Request, res: Response): void {

    res.status(200).send("Wonderful health");
}

export function editStory (req: Request, res: Response): void {
    const story:StoryDocument = req.body;
    const {documentId} = req.params;

    if(!story) res.send(MODIFY_FAIL);
    if(!documentId) res.send(ID_FAIL);
    
    Story.updateOne({id: documentId}, story);
}

export function deleteStory (req: Request, res:Response):void {
    const documentId:string = req.params?.id;

    if(!documentId) if(!documentId) res.send(ID_FAIL);

    Story.deleteOne({id:documentId});
    res.status(301).send("Resource deleted");
}


router.post("/create", createStory);
router.get("/health", health);
router.put("/modify", editStory);
router.delete("/delete", deleteStory);

export default router;

