import { Router } from "express";
import { User, UserDocument, AuthToken } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { IVerifyOptions } from "passport-local";
import { WriteError } from "mongodb";
import { body, check, validationResult } from "express-validator";
import passport from "passport";
import "../config/passport";
import { NativeError } from "mongoose";

const router = Router();

export function register (req: Request, res: Response): void {
    const userParam: UserDocument = req.body;
    const newStory = new User(userParam);
    newStory.save();

    res.status(200).send("Registration successful");
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

    passport.authenticate("local", (err: Error, user: UserDocument, info: IVerifyOptions) => {
        if (err) { next(err); }
        if (!user) {
            req.flash("errors", {msg: info.message});
        }
        req.logIn(user, (err) => {
            if (err) { next(err); }
            req.flash("success", { msg: "Success! You are logged in." });
            user.tokens.push();
            res.send(user);
        });
    })(req, res, next);
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

    const user = new User({
        email: req.body.email,
        password: req.body.password
    });

    User.findOne({ email: req.body.email }, (err: NativeError, existingUser: UserDocument) => {
        if (err) { next(err); }
        if (existingUser) {
            req.flash("errors", { msg: "Account with that email address already exists." });
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

export default router;

