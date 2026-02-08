var express = require("express");
var router = express.Router();

const AuthService = require("../services/auth.service");
const asyncHandler = require("../middlewares/asyncHandler");
const errorHandler = require("../middlewares/errorHandler");
const Enum = require("../config/Enum");
const Response = require("../lib/Response");
const rateLimit = require("../middlewares/rateLimit");

router.post("/login", rateLimit, asyncHandler( async (req, res) => {
    const result = await AuthService.login(req.body);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(result));
}));

router.post("/refresh", asyncHandler(async(req, res) => {
    const { refreshToken } = req.body;
    const tokens = await AuthService.refresh(refreshToken);
    res.json(Response.successResponse(tokens));
}));

router.post("/logout", asyncHandler(async(req, res) => {
    const { refreshToken } = req.body;
    await AuthService.logout(refreshToken);
    res.json(Response.successResponse({ success: true }));
}));

module.exports = router;