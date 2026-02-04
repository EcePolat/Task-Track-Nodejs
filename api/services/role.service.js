const Enum = require("../config/Enum");
const Roles = require("../db/models/Roles");
const CustomError = require("../lib/Error");


class RoleService{

    static async create(data){

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

    static async update(id, data){

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

        return Roles.findByIdAndUpdate(
            id,
            updates,
            {new: true, runValidators: true}
        );
    }

    static async delete(id){

        if(!id){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error",
                "id field is required"
            );
        }

        await Roles.findByIdAndDelete(id);

        return {success: true};
    }
}

module.exports = RoleService;