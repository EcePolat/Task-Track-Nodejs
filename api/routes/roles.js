var express = require("express");
var router = express.Router();

const Response = require("../lib/Response");
const Enum = require("../config/Enum");
const RoleService = require("../services/role.service");
const auth = require("../middlewares/auth");
const asyncHandler = require("../middlewares/asyncHandler");
const permission = require("../middlewares/permission");
const { PRIVILEGES } = require("../config/privileges");

/**
 * @swagger
 * /roles:
 *    post:
 *      summary: Rol Oluştur
 *      description: ROLE_CREATE yetkisi gerektirir
 *      tags:
 *        - Roles
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - name
 *                - permissions
 *              properties:
 *                name:
 *                  type: string
 *                  example: ADMIN
 *                permissions:
 *                  type: array
 *                  items: 
 *                      type: string
 *                  example:
 *                    - USER_VIEW
 *                    - USER_DELETE
 *      responses:
 *        200:
 *          description: Rol oluşturuldu
 */
router.post("/", auth, permission(PRIVILEGES.ROLE_CREATE.key), asyncHandler ( async(req, res) => {
    const role = await RoleService.create(req.body, req.user.id);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(role));
}));

/**
 * @swagger
 * /roles:
 *    get:
 *      summary: Rol Listele
 *      description: ROLE_VIEW yetkisi gerektirir
 *      tags:
 *        - Roles
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Roller listelendi
 */
router.get("/", auth, permission(PRIVILEGES.ROLE_VIEW.key), asyncHandler ( async(req, res) => {
    const roles = await RoleService.list();
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(roles));
}));

/**
 * @swagger
 * /roles/me:
 *    get:
 *      summary: Giriş yapan kullanıcının rolünü görüntüle
 *      tags:
 *        - Roles
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Giriş yapan kullanıcının rolü listelendi
 */
router.get("/me", auth, asyncHandler (async(req, res) => {
    res.json(Response.successResponse({
        role: req.user.role,
        permissions: req.user.permissions
    }));
}));

/**
 * @swagger
 * /roles/{id}:
 *    get:
 *      summary: ID ile rol listele
 *      description: ROLE_VIEW yetkisi gerektirir
 *      tags:
 *        - Roles
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Rol ID
 *      responses:
 *        200:
 *          description: ID ile rol listelendi
 */
router.get("/:id", auth, permission(PRIVILEGES.ROLE_VIEW.key), asyncHandler (async(req, res) => {
    const role = await RoleService.getById(req.params.id);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(role));
}));

/**
 * @swagger
 * /roles/{id}:
 *    put:
 *      summary: Rol güncelle
 *      description: ROLE_UPDATE yetkisi gerektirir
 *      tags:
 *        - Roles
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Rol ID
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                permissions:
 *                  type: array
 *                  items: 
 *                      type: string
 *      responses:
 *        200:
 *          description: Güncellenmiş rol
 */
router.put("/:id", auth, permission(PRIVILEGES.ROLE_UPDATE.key), asyncHandler ( async (req, res) => {
    const updatedRole = await RoleService.update(req.params.id, req.body, req.user.id);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(updatedRole));
}));

/**
 * @swagger
 * /roles/{id}:
 *    delete:
 *      summary: Rol Sil
 *      description: ROLE_DELETE yetkisi gerektirir
 *      tags:
 *        - Roles
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Rol ID
 *      responses:
 *        200:
 *          description: Rol silindi
 */
router.delete("/:id", auth, permission(PRIVILEGES.ROLE_DELETE.key), asyncHandler( async(req, res) => {
    await RoleService.delete(req.params.id, req.user.id);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse({success: true}));
}));

module.exports = router;