var express = require('express');
var router = express.Router();

const UserService = require("../services/user.service");
const asyncHandler = require("../middlewares/asyncHandler");
const errorHandler = require("../middlewares/errorHandler");
const Enum = require("../config/Enum");
const Response = require("../lib/Response");
const auth = require("../middlewares/auth");

router.post('/', asyncHandler(async (req, res) => {

  const user = await UserService.create(req.body);
  res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse(user));

}));

router.get("/", asyncHandler( async(req, res) => {

  const users = await UserService.list(req.query);
  res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(users));

}));

router.get("/:id", asyncHandler(async (req, res) => {

  const user = await UserService.getById(req.params.id);
  res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(user));

}));

router.put("/me", auth, asyncHandler( async (req, res) => {

  const updatedUser = await UserService.update(req.user.id, req.body);
  res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(updatedUser));

}));

router.delete("/me", auth, asyncHandler( async (req, res) => {

  const deletedUser = await UserService.delete(req.user.id);
  res.status(Enum.HTTP_CODES.OK).json(Response.successResponse({success: true}));

}));

module.exports = router;
