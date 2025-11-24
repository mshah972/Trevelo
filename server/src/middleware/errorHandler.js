export function errorHandler(err, _req, res, _next) {
    const status =
        err.code === "BAD_REQUEST" ? 400 :
            err.code === "ZOD_VALIDATION_ERROR" ? 400 :
                err.code === "OPENAI_API_ERROR" ? 502 :
                    500;
    res.status(status).json({ ok: false, error: err.message, ...(err.details ? { details: err.details } : {}) });
}