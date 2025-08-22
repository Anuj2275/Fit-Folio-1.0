// backend/src/middleware/validate.middleware.js

// This middleware validates the request body against a Joi schema
export default (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        // Why it's better: This provides a much better user experience for the client. Instead of getting one error at a time (e.g., "Email is required," then after fixing that, "Password is too short"), they get a comprehensive list of all issues with their submission in one response. This is crucial for forms where multiple fields might be incorrect.
        abortEarly: false, // Report all errors at once

        // What it does: If the client sends properties in the request body that are not defined in your Joi schema, stripUnknown: true will remove those unknown properties from the validated value object.
        stripUnknown: true // Remove unknown properties from the validated object
    });
    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        return res.status(400).json({ message: errorMessage });
    }
    req.body = value; // Replace req.body with the validated and sanitized value
    next();
};

/*
export default (schema)=> (req,res,next)=>{
    const {error,value} =   schema.validate(req.body,{
    stripUnknown:true,
    abortEarly:false
    })
    if(error){
        const ermsg = error.details.map(detail=> detail.message).join(', ');
        return res.status(400).json({message:ermsg});
    }
    
    req.body = value;
    next();
}
*/