var express = require("express");
var router = express.Router();

const AuthService = require("../services/auth.service");
const asyncHandler = require("../middlewares/asyncHandler");
const errorHandler = require("../middlewares/errorHandler");
const Enum = require("../config/Enum");
const Response = require("../lib/Response");

router.post("/login", asyncHandler( async (req, res) => {

    const result = await AuthService.login(req.body);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(result));
}));

module.exports = router;