var express = require('express');
var router = express.Router();

const RecordService = require("../services/record.service");
const Enum = require("../config/Enum");
const Response = require("../lib/Response");
const asyncHandler = require("../middlewares/asyncHandler");
const errorHandler = require("../middlewares/errorHandler");
const auth = require("../middlewares/auth");

router.post("/", auth, asyncHandler(async(req, res) => {

    const record = await RecordService.create(req.body, req.user.id);
    res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse(record));

}));

router.get("/", auth, asyncHandler(async(req, res) => {

    const records = await RecordService.list(req.query, req.user.id);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(records));
    
}));

router.get("/:id", auth, asyncHandler(async(req, res) => {

    const record = await RecordService.getById(req.params.id, req.user.id);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(record));
    
}));

router.put("/:id", auth, asyncHandler(async(req, res) => {

    const updatedRecord = await RecordService.update(req.params.id, req.body, req.user.id);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(updatedRecord));
    
}));

router.delete("/:id", auth, asyncHandler(async(req, res) => {
    
    const deletedRecord = await RecordService.delete(req.params.id, req.user.id);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse({success: true}));
    
}));

module.exports = router;