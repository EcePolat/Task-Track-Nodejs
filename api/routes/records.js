var express = require('express');
var router = express.Router();

const RecordService = require("../services/record.service");
const Enum = require("../config/Enum");
const Response = require("../lib/Response");
const asyncHandler = require("../middlewares/asyncHandler");
const errorHandler = require("../middlewares/errorHandler");
const auth = require("../middlewares/auth");
const permission = require("../middlewares/permission");
const { PRIVILEGES } = require("../config/privileges");

/**
 * @swagger
 * /records:
 *   post:
 *     summary: Kayıt oluştur
 *     description: RECORD_CREATE yetkisi gerektirir
 *     tags:
 *       - Records
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Bug fix
 *               description:
 *                 type: string
 *                 example: Login hatası çözülecek
 *               status:
 *                 type: string
 *                 enum:
 *                   - OPEN
 *                   - IN_PROGRESS
 *                   - CLOSED
 *                 example: OPEN
 *     responses:
 *       201:
 *         description: Kayıt oluşturuldu
 */
router.post("/", auth, permission(PRIVILEGES.RECORD_CREATE.key), asyncHandler(async(req, res) => {

    const record = await RecordService.create(req.body, req.user.id);
    res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse(record));

}));

/**
 * @swagger
 * /records:
 *   get:
 *     summary: Kayıtları listele
 *     description: RECORD_VIEW yetkisi gerektirir
 *     tags:
 *       - Records
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kayıt listesi
 */
router.get("/", auth, permission(PRIVILEGES.RECORD_VIEW.key), asyncHandler(async(req, res) => {

    const records = await RecordService.list(req.query, req.user.id, req.user.role);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(records));
    
}));

/**
 * @swagger
 * /records/{id}:
 *   get:
 *     summary: ID ile kayıt getir
 *     description: RECORD_VIEW yetkisi gerektirir
 *     tags:
 *       - Records
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kayıt ID
 *     responses:
 *       200:
 *         description: Kayıt bilgisi
 */
router.get("/:id", auth, permission(PRIVILEGES.RECORD_VIEW.key), asyncHandler(async(req, res) => {

    const record = await RecordService.getById(req.params.id, req.user.id, req.user.role);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(record));
    
}));

/**
 * @swagger
 * /records/{id}:
 *   put:
 *     summary: Kayıt güncelle
 *     description: RECORD_UPDATE yetkisi gerektirir
 *     tags:
 *       - Records
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kayıt ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum:
 *                   - OPEN
 *                   - IN_PROGRESS
 *                   - CLOSED
 *     responses:
 *       200:
 *         description: Güncellenmiş kayıt
 */
router.put("/:id", auth, permission(PRIVILEGES.RECORD_UPDATE.key), asyncHandler(async(req, res) => {

    const updatedRecord = await RecordService.update(req.params.id, req.body, req.user.id, req.user.role);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(updatedRecord));
    
}));

/**
 * @swagger
 * /records/{id}:
 *   delete:
 *     summary: Kayıt sil
 *     description: RECORD_DELETE yetkisi gerektirir
 *     tags:
 *       - Records
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kayıt ID
 *     responses:
 *       200:
 *         description: Kayıt silindi
 */
router.delete("/:id", auth, permission(PRIVILEGES.RECORD_DELETE.key), asyncHandler(async(req, res) => {
    
    const deletedRecord = await RecordService.delete(req.params.id, req.user.id, req.user.role);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse({success: true}));
    
}));

module.exports = router;