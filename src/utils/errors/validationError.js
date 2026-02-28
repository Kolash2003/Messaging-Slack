import { StatusCodes } from "http-status-codes";

// RESASON TO USE CONSTRUCTOR IS TO ADD CUSTOM PROPERTIES TO THE ERROR OBJECT
class ValidationError extends Error {
    constructor(errorDetails, message) { // the reason for using constructor is to add custom properties to the error object
        super(message);
        this.name = `ValidationError`;
        let explanation = [];
        Object.keys(errorDetails.error).forEach(key => {
            explanation.push(errorDetails.error[key]); // explanation is an array for all the values of keys in error object
        });
        this.explanation = explanation; // here we have added a custom property to the error object
        this.message = message;
        this.statusCode = StatusCodes.BAD_REQUEST; // this is also a custom property
    }
}

export default ValidationError;
