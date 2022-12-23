import urlSchema from "../schemas/urlSchema.js";

export default function urlValidate(req, res, next) {
    const { error, value} = urlSchema.validate(req.body, {abortEarly: false});

    if(error) {
        return res.status(422).send(error.details.map(detail => detail.message));

        next();
    }
}