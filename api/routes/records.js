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

router.post("/", auth, permission(PRIVILEGES.RECORD_CREATE.key), asyncHandler(async(req, res) => {

    const record = await RecordService.create(req.body, req.user.id);
    res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse(record));

}));

router.get("/", auth, permission(PRIVILEGES.RECORD_VIEW.key), asyncHandler(async(req, res) => {

    const records = await RecordService.list(req.query, req.user.id, req.user.role);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(records));
    
}));

router.get("/:id", auth, permission(PRIVILEGES.RECORD_VIEW.key), asyncHandler(async(req, res) => {

    const record = await RecordService.getById(req.params.id, req.user.id, req.user.role);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(record));
    
}));

router.put("/:id", auth, permission(PRIVILEGES.RECORD_UPDATE.key), asyncHandler(async(req, res) => {

    const updatedRecord = await RecordService.update(req.params.id, req.body, req.user.id, req.user.role);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(updatedRecord));
    
}));

router.delete("/:id", auth, permission(PRIVILEGES.RECORD_DELETE.key), asyncHandler(async(req, res) => {
    
    const deletedRecord = await RecordService.delete(req.params.id, req.user.id, req.user.role);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse({success: true}));
    
}));

module.exports = router;