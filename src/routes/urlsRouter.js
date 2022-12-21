import { Router } from "express";
import { postUrl, getUrl } from "../controllers/urlsController.js";

const urlsRouter = Router();


urlsRouter.post('/urls/shorten', postUrl);

urlsRouter.get('/urls/:id', getUrl);

export default urlsRouter;