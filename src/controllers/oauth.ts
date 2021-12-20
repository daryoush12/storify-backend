import { NextFunction } from "express";
import { NativeError } from "mongoose";
import { OAuth2Server, createServer, grant } from "oauth2orize";
import { UserDocument, AuthToken } from "../models/User";
import {uid} from "../util/uid";
import passport from "passport";

const server: OAuth2Server = createServer();

server.grant(grant.code(function(client:string, redirectURI:string, user: UserDocument, done ) {
    const code = uid(16);
    const token: AuthToken = {accessToken: code, kind: "Bearer"};
    user.tokens.push(token);
    user.save(function(err: NativeError) {
      if (err) { return done(err); }
      return done(null, code);
    });
  }));

const token = [
    passport.authenticate(["basic", "oauth2-client-password"], {session: false}), 
    server.token(), 
    server.errorHandler()
];
    
export default token;
  