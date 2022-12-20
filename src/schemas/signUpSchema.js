import Joi from "joi";

const signUpSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    repeatPassword: Joi.ref("password"),
});

export default signUpSchema;