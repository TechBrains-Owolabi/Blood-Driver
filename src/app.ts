import bodyParser from 'body-parser';
import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { AppRouter } from './AppRouter';
import { globalErrorHandler } from './middlewares';
import './controllers/AuthController';
import './controllers/RootController';
import './controllers/BloodDriveHostController';

const app = express();

app.use(cookieSession({ keys: ['ldlkdd'] }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(AppRouter.getInstance());

app.use(globalErrorHandler);

export default app;
