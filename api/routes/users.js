var express = require('express');
var router = express.Router();

const UserService = require("../services/user.service");
const asyncHandler = require("../middlewares/asyncHandler");
const errorHandler = require("../middlewares/errorHandler");
const Enum = require("../config/Enum");
const Response = require("../lib/Response");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");
const { PRIVILEGES } = require("../config/privileges");

/**
 * @swagger
 * /users:
 *    post:
 *      summary: Kullanıcı oluştur
 *      tags:
 *        - Users
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *                - password
 *                - role_id
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                password:
 *                  type: string
 *                  example: 12345678
 *                firstname:
 *                  type: string
 *                  example: Ece
 *                lastname:
 *                  type: string
 *                  example: Polat
 *                role_id:
 *                  type: string
 *                  example: 696e5b4665656
 *      responses:
 *        201:
 *          description: kullanıcı oluşturuldu
 */
router.post('/', asyncHandler(async (req, res) => {

  const user = await UserService.create(req.body);
  res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse(user));

}));

/**
 * @swagger
 * /users:
 *    get:
 *      summary: Kullanıcıları listele
 *      tags:
 *        - Users
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Kullanıcı listesi
 */
router.get("/", auth, permission(PRIVILEGES.USER_VIEW.key), asyncHandler( async(req, res) => {

  const users = await UserService.list(req.query);
  res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(users));

}));

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: ID ile kullanıcı getir
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kullanıcı ID
 *     responses:
 *       200:
 *         description: Kullanıcı bilgisi
 */
router.get("/:id", auth, permission(PRIVILEGES.USER_VIEW.key), asyncHandler(async (req, res) => {

  const user = await UserService.getById(req.params.id);
  res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(user));

}));

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Giriş yapan kullanıcının bilgilerini güncelle
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                firstname:
 *                  type: string
 *                lastname:
 *                  type: string
 *                password:
 *                  type: string
 *     responses:
 *       200:
 *         description: Güncellenmiş kullanıcı bilgisi
 */
router.put("/me", auth, asyncHandler( async (req, res) => {

  const updatedUser = await UserService.update(req.user.id, req.body);
  res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(updatedUser));

}));

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Giriş yapan kullanıcının hesabını silmesi
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Silme işlemi başarılı
 */
router.delete("/me", auth, asyncHandler( async (req, res) => {

  await UserService.delete(req.user.id, req.user.id);
  res.status(Enum.HTTP_CODES.OK).json(Response.successResponse({success: true}));

}));

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: ID ile kullanıcı sil
 *     description: USER_DELETE yetkisi gerektirir
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Silinecek kullanıcı ID
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla silindi
 */
router.delete("/:id", auth, permission(PRIVILEGES.USER_DELETE.key), asyncHandler(async(req, res) => {

  await UserService.delete(req.params.id, req.user.id);
  res.status(Enum.HTTP_CODES.OK).json(Response.successResponse({ success: true}));
}));

module.exports = router;
