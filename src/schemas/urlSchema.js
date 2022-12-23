import Joi from "joi";

const urlSchema = Joi.object({
    url: Joi.string().required(),
});

export default urlSchema;