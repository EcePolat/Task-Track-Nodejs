var express = require('express');
var router = express.Router();

const RecordService = require("../services/record.service");
const Enum = require("../config/Enum");
const Response = require("../lib/Response");
const asyncHandler = require("../middlewares/asyncHandler");
const errorHandler = require("../middlewares/errorHandler");

router.post("/", asyncHandler(async(req, res) => {

    const record = await RecordService.create(req.body);
    res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse(record));

}));

router.get("/", asyncHandler(async(req, res) => {

    const records = await RecordService.list(req.query);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(records));
    
}));

router.get("/:id", asyncHandler(async(req, res) => {

    const record = await RecordService.getById(req.params.id);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(record));
    
}));

router.put("/:id", asyncHandler(async(req, res) => {

    const updatedRecord = await RecordService.update(req.params.id, req.body);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(updatedRecord));
    
}));

router.delete("/:id", asyncHandler(async(req, res) => {
    
    const deletedRecord = await RecordService.delete(req.params.id);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse({success: true}));
    
}));

module.exports = router;