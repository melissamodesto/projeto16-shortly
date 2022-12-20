import signInSchema from "../schemas/signInSchema.js";

export default function signInSchemaValidate(req, res, next) {
    const { error, value } = signInSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).send(error.details.map((error) => error.message));
    }

    next();
}