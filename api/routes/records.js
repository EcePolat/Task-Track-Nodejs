var express = require('express');
var router = express.Router();

const RecordService = require("../services/record.service");
const Enum = require("../config/Enum");
const Response = require("../lib/Response");

router.post("/", async(req, res) => {

    try{
        const record = await RecordService.create(req.body);
        res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse(record));
    } catch(err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }

});

router.get("/", async(req, res) => {

    try{
        const records = await RecordService.list();
        res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(records));
    } catch(err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.get("/:id", async(req, res) => {

    try{
        const record = await RecordService.getById(req.params.id);
        res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(record));
    } catch(err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.put("/:id", async(req, res) => {

    try{
        const updatedRecord = await RecordService.update(req.params.id, req.body);
        res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(updatedRecord));
    } catch(err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(Response.errorResponse(err));
    }

});

router.delete("/:id", async(req, res) => {
    
    try{
        const deletedRecord = await RecordService.delete(req.params.id);
        res.status(Enum.HTTP_CODES.OK).json(Response.successResponse({success: true}));
    } catch(err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

module.exports = router;