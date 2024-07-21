import express from 'express';
import 'express-async-errors'
import cookieSession from "cookie-session";
import {json} from "body-parser";
import mongoose from 'mongoose';
import {errorHandler,NotFound} from "@amtickets377/common"
import {createNewOrder} from "./routes/new";
import * as tty from "tty";
import {currentUser} from "@cloud-wave/common";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false
    // secure: true
}))
app.use(currentUser);
app.use(createNewOrder);
app.all('*', () => {
    throw new NotFound();
})
app.use(errorHandler);

export {app};