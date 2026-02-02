const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const Users = require("../db/models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");

class AuthService{

    static async login(data){

        if(!data.email || !data.password){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error",
                "All fields are required."
            );
        }

        const user = await Users
            .findOne({email: data.email})
            .select("+password");

        if(!user){
            throw new CustomError(
                Enum.HTTP_CODES.UNAUTHORIZED,
                "Unauthorized",
                "Email or password is incorrect"
            );
        }

        const isPasswordCorrect = await bcrypt.compare(
            data.password,
            user.password
        );

        if(!isPasswordCorrect){
            throw new CustomError(
                Enum.HTTP_CODES.UNAUTHORIZED,
                "Unauthorized",
                "Email or password is incorrect"
            );
        }

        const token = jwt.sign(
            {id: user._id},
            config.JWT.SECRET,
            {
                expiresIn: config.JWT.EXPIRE_TIME
            }
        );

        const userObj = user.toObject();
        delete userObj.password;

        return {
            token,
            user: userObj
        };
    }
}

module.exports = AuthService;