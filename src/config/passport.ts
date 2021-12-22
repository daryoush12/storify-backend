import passport from "passport";
import passportLocal from "passport-local";
import passportFacebook from "passport-facebook";
import passportBearer from "passport-http-bearer";
import passportBasic from "passport-http";
import passportOAuth2ClientPassword from "passport-oauth2-client-password";
import { find } from "lodash";

// import { User, UserType } from '../models/User';
import { User, UserDocument } from "../models/User";
import {Token, TokenDocument} from "../models/Token";
import { Request, Response, NextFunction } from "express";
import { NativeError } from "mongoose";
import { SESSION_SECRET } from "../util/secrets";
import { uid } from "../util/uid";


const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;
const BasicStrategy = passportBasic.BasicStrategy;
const BearerStrategy = passportBearer.Strategy;

passport.serializeUser<any, any>((req, user, done) => {
    done(undefined, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err: NativeError, user: UserDocument) => done(err, user));
});


/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err: NativeError, user: UserDocument) => {
        if (err) { return done(err); }
        if (!user) {
            return done(undefined, false, { message: `Email ${email} not found.` });
        }
        user.comparePassword(password, (err: Error, isMatch: boolean) => {
            if (err) { return done(err); }
            if (isMatch) {

                return done(undefined, user);
            }
            return done(undefined, false, { message: "Invalid email or password." });
        });
    });
}));


/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

passport.use(new BearerStrategy((token:string, done) => {  
    Token.findOne({ code: token }, function (err:NativeError, token:TokenDocument) {
        if (err) { return done(err); }
        if (!token) { return done(null, false); }
        return done(null, token, { scope: "all" });
      });
}));


 passport.use(new BasicStrategy((username: string, password:string, done) => {  
    User.findOne({ email: username }, function (err: NativeError, user: UserDocument) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        user.comparePassword(password, (err: NativeError, isMatch:boolean) => {
            if(isMatch){
                return done(null, user);
            }
            else return done(null, false);
        });
      });
 }));

/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }else {
        res.send("You need to be authenticated to access this endpoint");
    }
};

/**
 * Authorization Required middleware.
 */
export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
    const provider = req.path.split("/").slice(-1)[0];
    const tokenCode = req.headers["authorization"].split(" ")[1];

    if(!tokenCode) res.send("Bearer token not provided");
    
    Token.findOne({code:tokenCode}, function (err:NativeError, token:TokenDocument) {
        if(err) res.send(err.message);
        if (token) next();
        else res.send("You need to be authorized to access this endpoint");
    }); 
};