import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

import radarRouter from './radar/radar.routes';
const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());
app.use('/', radarRouter);

export { app };