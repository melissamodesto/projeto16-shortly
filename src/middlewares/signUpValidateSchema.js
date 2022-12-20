import signUpSchema from "../schemas/signUpSchema.js";

export default function signUpSchemaValidate(req, res, next) {

    const { error, value } = signUpSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(422).send(error.details.map((error) => error.message));
    }

    next();

}