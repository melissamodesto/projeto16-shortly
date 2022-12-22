import { Router } from "express";
import { getUsers, getRanking } from "../controllers/usersController";

const usersRouter = Router();

usersRouter.get('/users/:id', getUsers);

usersRouter.get('/users/ranking', getRanking);

export default usersRouter;