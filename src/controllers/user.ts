import { Router } from "express";
import { User, UserDocument, AuthToken } from "../models/User";
import {Token, TokenDocument} from "../models/Token";
import { Request, Response, NextFunction } from "express";
import { IVerifyOptions } from "passport-local";
import { WriteError } from "mongodb";
import { body, check, validationResult } from "express-validator";
import passport from "passport";
import "../config/passport";
import { NativeError } from "mongoose";
import {uid} from "../util/uid";

const router = Router();

export function profile (req: Request, res: Response): void {
    User.findOne({ id: req.params.id }, function (err:NativeError, user:UserDocument) {
        if (err) { req.flash("errors", {msg: err.message}); }
        if (!user) { res.send("Profile not found"); }
        res.send(user);
    });
}

export const login = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password cannot be blank").isLength({min: 1}).run(req);
    await body("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        res.send(errors.array());
    }

    const logins = req.body as UserDocument;

    User.findOne({email: logins.email}, function(err:NativeError, user:UserDocument){
        if(err) res.send("Account was not found by email");

        user.comparePassword(logins.password, function(err:NativeError, isMatch:boolean) {
            if(!isMatch) res.send("Password was incorrect");

            const tokenDoc = {token: uid(24), type: "Bearer", user:user};
            const token = new Token(tokenDoc);
            token.save();
            res.send(tokenDoc);
        });
    });
};


export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
    await check("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);
    await body("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        res.send(errors.array());
    }
    const userParam: UserDocument = req.body;
    const user = new User({...userParam});

    User.findOne({ email: req.body.email }, (err: NativeError, existingUser: UserDocument) => {
        if (err) { next(err); }
        if (existingUser) {
           // req.flash("errors", { msg: "Account with that email address already exists." });
            res.send("Account with that email address already exists.");
        }
        user.save((err) => {
            if (err) { res.send(err); }
            req.logIn(user, (err) => {
                if (err) {
                    res.send(err);
                }
                res.send("Signup was successful.");
            });
        });
    });
};

router.post("/login", login);
router.post("/register", signup);
router.get("/me", profile);

export default router;

