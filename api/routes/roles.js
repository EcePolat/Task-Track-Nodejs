var express = require("express");
var router = express.Router();

const Response = require("../lib/Response");
const Enum = require("../config/Enum");
const RoleService = require("../services/role.service");
const auth = require("../middlewares/auth");
const asyncHandler = require("../middlewares/asyncHandler");
const permission = require("../middlewares/permission");
const { PRIVILEGES } = require("../config/privileges");

router.post("/", auth, permission(PRIVILEGES.ROLE_CREATE.key), asyncHandler ( async(req, res) => {
    const role = await RoleService.create(req.body);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(role));
}));

router.get("/", auth, permission(PRIVILEGES.ROLE_VIEW.key), asyncHandler ( async(req, res) => {
    const roles = await RoleService.list();
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(roles));
}));

router.get("/me", auth, asyncHandler (async(req, res) => {
    res.json(Response.successResponse({
        role: req.user.role,
        permissions: req.user.permissions
    }));
}));

router.get("/:id", auth, permission(PRIVILEGES.ROLE_VIEW.key), asyncHandler (async(req, res) => {
    const role = await RoleService.getById(req.params.id);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(role));
}));

router.put("/:id", auth, permission(PRIVILEGES.ROLE_UPDATE.key), asyncHandler ( async (req, res) => {
    const updatedRole = await RoleService.update(req.params.id, req.body);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse(updatedRole));
}));

router.delete("/:id", auth, permission(PRIVILEGES.ROLE_DELETE.key), asyncHandler( async(req, res) => {
    await RoleService.delete(req.params.id);
    res.status(Enum.HTTP_CODES.OK).json(Response.successResponse({success: true}));
}));

module.exports = router;