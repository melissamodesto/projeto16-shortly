import express, { json } from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';
import urlsRouter from './routes/urlsRouter.js';
import usersRouter from './routes/usersRouter.js';

import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors(), json());


app.use(authRouter);

app.use(urlsRouter);

app.use(usersRouter);


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT || 4000}`);
})