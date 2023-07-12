const Joi = require('joi');

const validate = (schema) => (req, res, next) => {

    const verify = {
        body: schema.body && schema.body.validate(req.body),
        params: schema.params && schema.params.validate(req.params),
        query: schema.query && schema.query.validate(req.query)
    };

    const error = verify.body?.error || verify.params?.error || verify.query?.error;
    if (error) {
        const errorMessage = error.details[0].message;
        res.status(422).json({
            status: 422,
            message: errorMessage,
        });
    } else {
        next();
    }
};

module.exports = validate 