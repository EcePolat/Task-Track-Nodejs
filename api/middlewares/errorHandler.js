const Response = require("../lib/Response");

module.exports = (err, req, res, next) => {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
};