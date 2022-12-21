import { Router } from "express";
import { postUrl } from "../controllers/urlsController.js";

const urlsRouter = Router();

urlsRouter.post('/urls/shorten', postUrl);

export default urlsRouter;