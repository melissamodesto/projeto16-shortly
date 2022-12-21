import { Router } from "express";
import { postUrl, getUrl, deleteUrl, getShortUrl } from "../controllers/urlsController.js";

const urlsRouter = Router();


urlsRouter.post('/urls/shorten', postUrl);

urlsRouter.get('/urls/:id', getUrl);

urlsRouter.delete('/urls/:id', deleteUrl);

urlsRouter.get('/urls/open/:shortUrl', getShortUrl);

export default urlsRouter;