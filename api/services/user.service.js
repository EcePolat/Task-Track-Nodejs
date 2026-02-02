const Users = require("../db/models/Users");
const Enum = require("../config/Enum");
const CustomError = require("../lib/Error");
const is = require("is_js");
const bcrypt = require("bcrypt");

class UserService{

    static async create(data){

        if(!data.email || !data.password || !data.firstName){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error",
                "All fields are required"
            );
        }

        if(is.not.email(data.email)){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error!",
                "Email field must be an email format"
            );
        }

        if(data.password.length < Enum.PASSWORD_LENGTH){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error!",
                "Password must be greater than " + Enum.PASSWORD_LENGTH
            );
        }

        const existingUser = await Users.findOne({ email: data.email});

        if(existingUser){
            throw new CustomError(
                Enum.HTTP_CODES.CONFLICT,
                "Conflict",
                "email already exists"
            );
        }

        let hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await Users.create({
            email: data.email,
            password: hashedPassword,
            firstName: data.firstName,
            lastName: data.lastName,
        });

        // const userObj = user.toObject();
        // delete userObj.password;

        return user;
    }

    static async list(query){

        let page = parseInt(query.page) || 1;
        let limit = parseInt(query.limit) || 2;

        if(page < 1) page = 1;
        if(limit < 1) limit = 2;

        const skip = (page - 1) * limit;

        const filter = {};

        if(query.firstName){
            filter.firstName = query.firstName;
        }

        if(query.lastName){
            filter.lastName = query.lastName;
        }

        if(query.startDate || query.endDate){
            filter.created_at = {};

            if(query.startDate){
                filter.created_at.$gte = new Date(query.startDate);
            }

            if(query.endDate) {
                filter.created_at.$lte = new Date(query.endDate);
            }
        }

        const users = await Users.find(filter)
            .sort({ created_at: -1})
            .skip(skip)
            .limit(limit);

        return users;
    }

    static async getById(id){

        if(!id){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error!",
                "İd field must be filled"
            );
        }

        const user = await Users.findById(id);

        if(!user){
            throw new CustomError(
                Enum.HTTP_CODES.NOT_FOUND,
                "Not found",
                "User not found"
            );
        }

        return user;
    }
    
    static async update(id, data){
        
        if(!id){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error!",
                "id field must be filled"
            );
        }

        const updates = {};

        if(data.email) updates.email = data.email;
        if(data.password) updates.password = data.password;
        if(data.firstName) updates.firstName = data.firstName;
        if(data.lastName) updates.lastName = data.lastName;
        if(data.is_active) updates.is_active = data.is_active;

        if(Object.keys(updates).length === 0){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error",
                "At least one field must be filled"
            );
        }

        const updatedUser = await Users.findByIdAndUpdate(
            id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if(!updatedUser){
            throw new CustomError(
                Enum.HTTP_CODES.NOT_FOUND,
                "Not found",
                "User not found"
            );
        }

        return updatedUser;
    }

    static async delete(id){

        if(!id){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error!",
                "id field must be filled"
            );
        }

        const deletedUser = await Users.findByIdAndDelete(id);

        if(!deletedUser){
            throw new CustomError(
                Enum.HTTP_CODES.NOT_FOUND,
                "Not found",
                "User not found"
            );
        }

        return deletedUser;

    }

}

module.exports = UserService;