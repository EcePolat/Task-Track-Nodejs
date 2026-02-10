var express = require("express");
var router = express.Router();

const AuthService = require("../services/auth.service");
const asyncHandler = require("../middlewares/asyncHandler");
const errorHandler = require("../middlewares/errorHandler");
const Enum = require("../config/Enum");
const Response = require("../lib/Response");
const rateLimit = require("../middlewares/rateLimit");

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Kullanıcı girişi
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@mail.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: JWT token döner
 */
router.post("/login", rateLimit, asyncHandler( async (req, res) => {
    const result = await AuthService.login(req.body);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(result));
}));

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Token yenile
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: JWT token döner
 */
router.post("/refresh", asyncHandler(async(req, res) => {
    const { refreshToken } = req.body;
    const tokens = await AuthService.refresh(refreshToken);
    res.json(Response.successResponse(tokens));
}));

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Oturum kapat
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Çıkış başarılı
 */
router.post("/logout", asyncHandler(async(req, res) => {
    const { refreshToken } = req.body;
    await AuthService.logout(refreshToken);
    res.json(Response.successResponse({ success: true }));
}));

module.exports = router;