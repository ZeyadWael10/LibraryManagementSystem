export const ValidationFunction = (schema) => {
    return (req, res, next) => {
        let validationErrorsArr = []
        const requestKeys = ["body", "query", "params", "headers", "file", "files"]
        for (const key of requestKeys) {
            if (schema[key]) {
                const validationResult = schema[key].validate(req[key], { abortEarly: false })
                if (validationResult?.error?.details) {
                    validationErrorsArr.push(validationResult.error.details)
                }
            }
            if (validationErrorsArr.length) {
                return res.json({ message: "Validation Error", Errors: validationErrorsArr })
            }
        } 
        return next()
    }
}