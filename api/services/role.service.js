const Enum = require("../config/Enum");
const Roles = require("../db/models/Roles");
const CustomError = require("../lib/Error");
const AuditLogService = require("./auditLog.service");

class RoleService{

    static async create(data, userId){

        if(!data.name && !data.permissions){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation error",
                "Name and permissions fields are required"
            );
        }

        const role = await Roles.create({
            name: data.name,
            permissions: data.permissions
        });

        await AuditLogService.log({
            userId,
            action: "CREATE",
            entity: "roles",
            entityId: role._id,
            detail: {
                name: role.name
            }
        });

        return role;
    }

    static async list(){

        const roles = await Roles.find();

        return roles;
    }

    static async getById(id){

        if(!id){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error",
                "id field is required"
            );
        }

        const role = await Roles.findById(id);

        if(!role){
            throw new CustomError(
                Enum.HTTP_CODES.NOT_FOUND,
                "Not found",
                "Role not found"
            );
        }

        return role;
    }

    static async update(id, data, userId){

        if(!id){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error",
                "id field is required"
            );
        }

        const updates = {}

        if(data.name) updates.name = data.name;
        if(data.permissions) updates.permissions = data.permissions;

        const updatedRole = await Roles.findByIdAndUpdate(
            id,
            updates,
            {new: true, runValidators: true}
        );

        await AuditLogService.log({
            userId,
            action: "UPDATE",
            entity: "roles",
            entityId: id,
            detail: {
                name: updatedRole.name
            }
        });

        return updatedRole;
    }

    static async delete(id, userId){

        if(!id){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error",
                "id field is required"
            );
        }

        const role = await Roles.findById(id);

        await Roles.findByIdAndDelete(id);

        await AuditLogService.log({
            userId,
            action: "DELETE",
            entity: "roles",
            entityId: id,
            detail: {
                name: role.name
            }
        });

        return {success: true};
    }
}

module.exports = RoleService;