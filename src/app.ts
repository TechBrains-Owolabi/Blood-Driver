import bodyParser from 'body-parser';
import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { AppRouter } from './AppRouter';
import { globalErrorHandler } from './middlewares';
import './controllers/AuthController';
import './controllers/RootController';
import './controllers/BloodDriveHostController';
import './controllers/UserController';
import './controllers/HospitalController';
import { HttpStatusCodes } from './enums';

const app = express();

app.use(cookieSession({ keys: [process.env.SESSION_KEY!] }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("hello")
})

app.use(AppRouter.getInstance());

app.use(globalErrorHandler);

app.use("*", (req, res) => {
    res.status(HttpStatusCodes.NOT_FOUND).json()
})

export default app;
