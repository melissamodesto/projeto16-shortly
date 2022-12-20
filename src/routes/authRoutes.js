import { Router } from "express";
import { postSignIn, postSignUp } from "../controllers/authController.js";
import signInSchemaValidate from "../middlewares/signInValidateSchema.js";
import signUpSchemaValidate from "../middlewares/signUpValidateSchema.js";


const authRouter = Router();

authRouter.post('/signup', signUpSchemaValidate, postSignUp);
authRouter.post('/signin', signInSchemaValidate, postSignIn);

export default authRouter;