const joi = require("joi");
const listingSchema = joi.object({
    listing : joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required(),
        country: joi.string().required(),
        location: joi.string().required(),
        image: joi.string().allow("", null)
    }).required
});