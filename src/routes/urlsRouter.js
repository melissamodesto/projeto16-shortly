import { Router } from "express";
import { postUrl, getUrl, deleteUrl, getShortUrl } from "../controllers/urlsController.js";
import urlValidate from "../middlewares/urlValidate.js";

const urlsRouter = Router();


urlsRouter.post('/urls/shorten', urlValidate, postUrl);

urlsRouter.get('/urls/:id', getUrl);

urlsRouter.delete('/urls/:id', deleteUrl);

urlsRouter.get('/urls/open/:shortUrl', getShortUrl);

export default urlsRouter;